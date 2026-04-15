import os
import time
from pathlib import Path

import pandas as pd

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

# =========================================================
# BASE CONFIG
# =========================================================
BASE_DIR = Path(__file__).resolve().parent

PAGE_W, PAGE_H = A4
MARGIN_L = 15 * mm
MARGIN_R = 15 * mm
MARGIN_T = 18 * mm
MARGIN_B = 15 * mm

CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

# =========================================================
# COLORS
# =========================================================
WHITE = colors.white
BLACK = colors.black

GRAY_900 = colors.HexColor("#111827")
GRAY_700 = colors.HexColor("#374151")
GRAY_600 = colors.HexColor("#4B5563")
GRAY_500 = colors.HexColor("#6B7280")
GRAY_400 = colors.HexColor("#9CA3AF")
GRAY_300 = colors.HexColor("#D1D5DB")
GRAY_200 = colors.HexColor("#E5E7EB")
GRAY_100 = colors.HexColor("#F3F4F6")
GRAY_50 = colors.HexColor("#F9FAFB")

# =========================================================
# COMPANY INFO
# =========================================================
COMPANY_NAME = "PT PILAR NIAGA MAKMUR"
COMPANY_ADDRESS = [
    "Ruko Duta Garden, Komplek No.08-09 Blok B4, Jurumudi Baru",
    "Kec. Benda, Kota Tangerang, Banten 15124",
]
COMPANY_NPWP = "76.651.638.9-402.000"

LOGO_PATH = BASE_DIR / "logo.jpeg"


# =========================================================
# HELPERS
# =========================================================
def fmt_rp(val):
    try:
        v = int(round(float(val)))
        return f"Rp {v:,}".replace(",", ".")
    except Exception:
        return "-"


def fmt_date(val):
    try:
        if hasattr(val, "strftime"):
            return val.strftime("%d %B %Y")
        return str(val)
    except Exception:
        return str(val)


def safe_str(val, default="-"):
    if val is None:
        return default

    try:
        if pd.isna(val):
            return default
    except Exception:
        pass

    text = str(val).strip()
    return text if text else default


def safe_num(val, default=0):
    try:
        if val is None:
            return default

        if pd.isna(val):
            return default

        if isinstance(val, str):
            cleaned = (
                val.replace("Rp", "")
                .replace("rp", "")
                .replace("IDR", "")
                .replace("idr", "")
                .replace(" ", "")
                .replace(".", "")
                .replace(",", ".")
                .strip()
            )

            if cleaned in ["", "-", "–", "nan", "None"]:
                return default

            return float(cleaned)

        return float(val)
    except Exception:
        return default


def safe_int(val, default=1):
    try:
        if val is None:
            return default
        if pd.isna(val):
            return default
        return int(float(val))
    except Exception:
        return default


def cleanup_old_files(folder_path, max_age_hours=24):
    """
    Hapus file lama di folder output/outputs yang umurnya lebih dari max_age_hours.
    Default: 24 jam / 1 hari
    """
    try:
        folder = Path(folder_path)
        if not folder.exists() or not folder.is_dir():
            return

        now = time.time()
        max_age_seconds = max_age_hours * 3600

        for file_path in folder.iterdir():
            if file_path.is_file():
                try:
                    file_age = now - file_path.stat().st_mtime
                    if file_age > max_age_seconds:
                        file_path.unlink()
                        print(f"[CLEANUP] Deleted old file: {file_path.name}")
                except Exception as e:
                    print(f"[CLEANUP] Gagal hapus {file_path.name}: {e}")
    except Exception as e:
        print(f"[CLEANUP] Error saat membersihkan folder: {e}")


def normalize_col_name(col_name):
    return str(col_name).strip().lower()


def find_column(df, candidates, required=False):
    """
    Cari kolom berdasarkan beberapa kemungkinan nama.
    Return nama kolom asli kalau ketemu.
    """
    normalized_map = {normalize_col_name(c): c for c in df.columns}

    for candidate in candidates:
        key = normalize_col_name(candidate)
        if key in normalized_map:
            return normalized_map[key]

    if required:
        raise ValueError(
            f"Kolom yang dibutuhkan tidak ditemukan. Coba salah satu dari: {candidates}"
        )

    return None


def get_first_available_value(row, candidate_columns, default=None):
    for col in candidate_columns:
        if col is None:
            continue
        try:
            if col in row.index:
                val = row.get(col, default)
                if val is not None:
                    try:
                        if pd.isna(val):
                            continue
                    except Exception:
                        pass
                    if str(val).strip() != "":
                        return val
        except Exception:
            pass
    return default


# =========================================================
# FILE READER
# =========================================================
def read_input_file(file_path):
    ext = Path(file_path).suffix.lower()

    if ext in [".xlsx", ".xls"]:
        df = pd.read_excel(file_path)
    elif ext == ".csv":
        try:
            df = pd.read_csv(file_path, low_memory=False)
        except Exception:
            try:
                df = pd.read_csv(file_path, sep=";", low_memory=False)
            except Exception:
                df = pd.read_csv(
                    file_path,
                    sep=None,
                    engine="python",
                    low_memory=False,
                )
    else:
        raise ValueError(
            "Format file tidak didukung. Gunakan .xlsx, .xls, atau .csv"
        )

    df.columns = [str(c).strip() for c in df.columns]
    return df


# =========================================================
# PDF PAGE BACKGROUND
# =========================================================
def draw_page_background(canv, doc):
    canv.saveState()
    canv.setFillColor(WHITE)
    canv.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canv.restoreState()


# =========================================================
# STYLES
# =========================================================
def make_styles():
    def s(name, **kwargs):
        return ParagraphStyle(name, **kwargs)

    return {
        "co_name": s(
            "co_name",
            fontName="Helvetica-Bold",
            fontSize=12.5,
            leading=14,
            textColor=GRAY_900,
            alignment=TA_LEFT,
        ),
        "co_detail": s(
            "co_detail",
            fontName="Helvetica",
            fontSize=7.7,
            leading=10.2,
            textColor=GRAY_600,
            alignment=TA_LEFT,
        ),
        "inv_title": s(
            "inv_title",
            fontName="Helvetica-Bold",
            fontSize=23,
            leading=24,
            textColor=GRAY_900,
            alignment=TA_RIGHT,
        ),
        "inv_meta": s(
            "inv_meta",
            fontName="Helvetica",
            fontSize=8.2,
            leading=10.8,
            textColor=GRAY_600,
            alignment=TA_RIGHT,
        ),
        "section": s(
            "section",
            fontName="Helvetica-Bold",
            fontSize=8.7,
            leading=10,
            textColor=GRAY_500,
            alignment=TA_LEFT,
        ),
        "lbl": s(
            "lbl",
            fontName="Helvetica",
            fontSize=7,
            leading=8.5,
            textColor=GRAY_500,
            alignment=TA_LEFT,
        ),
        "val": s(
            "val",
            fontName="Helvetica-Bold",
            fontSize=8.8,
            leading=11,
            textColor=GRAY_900,
            alignment=TA_LEFT,
        ),
        "val_sm": s(
            "val_sm",
            fontName="Helvetica-Bold",
            fontSize=8.4,
            leading=10.5,
            textColor=GRAY_900,
            alignment=TA_LEFT,
        ),
        "th": s(
            "th",
            fontName="Helvetica-Bold",
            fontSize=7.6,
            leading=9,
            textColor=GRAY_900,
            alignment=TA_CENTER,
        ),
        "th_l": s(
            "th_l",
            fontName="Helvetica-Bold",
            fontSize=7.6,
            leading=9,
            textColor=GRAY_900,
            alignment=TA_LEFT,
        ),
        "td": s(
            "td",
            fontName="Helvetica",
            fontSize=8.2,
            leading=10.8,
            textColor=GRAY_900,
            alignment=TA_LEFT,
        ),
        "td_c": s(
            "td_c",
            fontName="Helvetica",
            fontSize=8.2,
            leading=10.8,
            textColor=GRAY_600,
            alignment=TA_CENTER,
        ),
        "td_r": s(
            "td_r",
            fontName="Helvetica",
            fontSize=8.2,
            leading=10.8,
            textColor=GRAY_900,
            alignment=TA_RIGHT,
        ),
        "td_bold_r": s(
            "td_bold_r",
            fontName="Helvetica-Bold",
            fontSize=8.6,
            leading=10.8,
            textColor=GRAY_900,
            alignment=TA_RIGHT,
        ),
        "td_muted": s(
            "td_muted",
            fontName="Helvetica",
            fontSize=7.6,
            leading=10,
            textColor=GRAY_500,
            alignment=TA_CENTER,
        ),
        "sum_lbl": s(
            "sum_lbl",
            fontName="Helvetica",
            fontSize=8.3,
            leading=10.5,
            textColor=GRAY_700,
            alignment=TA_LEFT,
        ),
        "sum_val": s(
            "sum_val",
            fontName="Helvetica-Bold",
            fontSize=8.8,
            leading=11,
            textColor=GRAY_900,
            alignment=TA_RIGHT,
        ),
        "total_lbl": s(
            "total_lbl",
            fontName="Helvetica-Bold",
            fontSize=10.3,
            leading=12,
            textColor=GRAY_900,
            alignment=TA_LEFT,
        ),
        "total_val": s(
            "total_val",
            fontName="Helvetica-Bold",
            fontSize=12.6,
            leading=13.5,
            textColor=GRAY_900,
            alignment=TA_RIGHT,
            wordWrap="CJK",
        ),
        "note": s(
            "note",
            fontName="Helvetica",
            fontSize=7.7,
            leading=11,
            textColor=GRAY_600,
            alignment=TA_LEFT,
        ),
    }


# =========================================================
# COLUMN RESOLVER
# =========================================================
def resolve_columns(df):
    """
    Mapping fleksibel untuk berbagai template Excel.
    """
    return {
        "order_no": find_column(
            df,
            [
                "No Pesanan",
                "Nomor Pesanan",
                "Order No",
                "Nomor Order",
                "No Order",
            ],
            required=True,
        ),
        "invoice_no": find_column(
            df,
            [
                "No Invoice",
                "Nomor Invoice",
                "Invoice No",
                "Nomor",
                "No. Invoice",
            ],
            required=True,
        ),
        "print_time": find_column(
            df,
            [
                "Waktu Cetak Faktur",
                "Tanggal Cetak",
                "Tanggal Print",
            ],
            required=False,
        ),
        "warehouse": find_column(
            df,
            [
                "Warehouse",
                "Gudang",
            ],
            required=False,
        ),
        "store_name": find_column(
            df,
            [
                "Nama Toko",
                "Toko",
                "Nama Pembeli",
                "Nama Customer",
                "Customer",
                "Pembeli",
            ],
            required=False,
        ),
        "sku_induk": find_column(
            df,
            [
                "SKU Induk",
                "SKU Parent",
            ],
            required=False,
        ),
        "sku": find_column(
            df,
            [
                "SKU",
                "Kode SKU",
                "Kode Produk",
            ],
            required=False,
        ),
        "product_name": find_column(
            df,
            [
                "Nama Produk",
                "Produk",
                "Product Name",
                "Nama Barang",
            ],
            required=False,
        ),
        "unit_price": find_column(
            df,
            [
                "Harga Setelah Diskon",
                "Harga Satuan",
                "Harga",
                "Harga per Item",
            ],
            required=False,
        ),
        "qty": find_column(
            df,
            [
                "Jumlah",
                "Qty",
                "Quantity",
                "Kuantitas",
            ],
            required=False,
        ),
        "discount": find_column(
            df,
            [
                "Total Diskon",
                "Diskon",
                "Jumlah Diskon",
            ],
            required=False,
        ),
        "line_subtotal": find_column(
            df,
            [
                "Total Harga Produk",
                "Jumlah subtotal per Item",
                "Subtotal",
                "Subtotal Produk",
                "Total Produk",
            ],
            required=False,
        ),
        "shipping": find_column(
            df,
            [
                "Perkiraan Ongkos Kirim",
                "Pengiriman",
                "Ongkos Kirim",
                "Biaya Kirim",
            ],
            required=False,
        ),
        "voucher": find_column(
            df,
            [
                "Voucher",
                "Potongan Voucher",
                "Diskon Voucher",
            ],
            required=False,
        ),
        "total_payment": find_column(
            df,
            [
                "Total Pembayaran",
                "Jumlah Pembayaran",
                "Grand Total",
                "Total Bayar",
            ],
            required=False,
        ),
        "tax": find_column(
            df,
            [
                "Pajak",
            ],
            required=False,
        ),
    }


# =========================================================
# STORY BUILDER PER INVOICE
# =========================================================
def build_invoice_story(order_df, order_no, invoice_no, styles, cols):
    row0 = order_df.iloc[0]
    S = styles
    W = CONTENT_W

    print_time = fmt_date(
        get_first_available_value(row0, [cols["print_time"]], "-")
    )
    warehouse = safe_str(
        get_first_available_value(row0, [cols["warehouse"]], "-")
    )
    store_name = safe_str(
        get_first_available_value(row0, [cols["store_name"]], "-")
    )

    grand_total = 0
    if cols["line_subtotal"] and cols["line_subtotal"] in order_df.columns:
        grand_total = float(order_df[cols["line_subtotal"]].fillna(0).apply(safe_num).sum())

    shipping_est = safe_num(
        get_first_available_value(row0, [cols["shipping"]], 0)
    )
    voucher = safe_num(
        get_first_available_value(row0, [cols["voucher"]], 0)
    )

    # =====================================================
    # PAJAK OPSIONAL
    # Kalau kolom Pajak ada, jumlahkan per order
    # Kalau tidak ada, pajak = 0 dan tidak tampil
    # =====================================================
    tax = 0
    if cols["tax"] and cols["tax"] in order_df.columns:
        tax = float(order_df[cols["tax"]].fillna(0).apply(safe_num).sum())

    total_payment = safe_num(
        get_first_available_value(row0, [cols["total_payment"]], 0)
    )

    if total_payment <= 0:
        total_payment = grand_total + shipping_est + tax - voucher

    story = []

    logo_cell = (
        Image(str(LOGO_PATH), width=28 * mm, height=28 * mm)
        if LOGO_PATH.exists()
        else Spacer(28 * mm, 28 * mm)
    )

    left_w = W * 0.56
    right_w = W * 0.44

    company_block = [
        Paragraph(COMPANY_NAME, S["co_name"]),
        Spacer(1, 1.4 * mm),
        Paragraph(COMPANY_ADDRESS[0], S["co_detail"]),
        Paragraph(COMPANY_ADDRESS[1], S["co_detail"]),
        Paragraph(f"NPWP: {COMPANY_NPWP}", S["co_detail"]),
    ]

    left_company = Table(
        [[logo_cell, company_block]],
        colWidths=[32 * mm, left_w - 32 * mm],
    )
    left_company.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ("LEFTPADDING", (1, 0), (1, -1), 6),
            ]
        )
    )

    right_invoice = Table(
        [
            [Paragraph("INVOICE", S["inv_title"])],
            [Spacer(1, 1.2 * mm)],
            [Paragraph(f"No Invoice: <b>{safe_str(invoice_no)}</b>", S["inv_meta"])],
            [Paragraph(f"Tanggal Cetak: {print_time}", S["inv_meta"])],
        ],
        colWidths=[right_w],
    )
    right_invoice.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (0, 0), (-1, -1), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )

    header = Table(
        [[left_company, right_invoice]],
        colWidths=[left_w, right_w],
    )
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("LINEBELOW", (0, 0), (-1, -1), 0.8, GRAY_300),
            ]
        )
    )

    story.append(header)
    story.append(Spacer(1, 5.5 * mm))

    cw = W / 3

    def info_cell(label, value, style="val"):
        return [
            Paragraph(label.upper(), S["lbl"]),
            Spacer(1, 1.2),
            Paragraph(safe_str(value), S[style]),
        ]

    meta_row = Table(
        [[
            info_cell("No Pesanan", order_no, "val_sm"),
            info_cell("No Invoice", invoice_no),
            info_cell("Warehouse", warehouse),
        ]],
        colWidths=[cw, cw, cw],
    )
    meta_row.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), WHITE),
                ("BOX", (0, 0), (-1, -1), 0.6, GRAY_200),
                ("LINEAFTER", (0, 0), (1, -1), 0.4, GRAY_200),
                ("TOPPADDING", (0, 0), (-1, -1), 11),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )

    story.append(meta_row)
    story.append(Spacer(1, 4 * mm))

    toko_tbl = Table(
        [[info_cell("Nama Toko", store_name)]],
        colWidths=[W],
    )
    toko_tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), WHITE),
                ("BOX", (0, 0), (-1, -1), 0.6, GRAY_200),
                ("TOPPADDING", (0, 0), (-1, -1), 11),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )

    story.append(toko_tbl)
    story.append(Spacer(1, 6 * mm))

    story.append(Paragraph("DETAIL PRODUK", S["section"]))
    story.append(Spacer(1, 2.4 * mm))

    col_w = [
        9 * mm,
        28 * mm,
        65 * mm,
        22 * mm,
        12 * mm,
        18 * mm,
        26 * mm,
    ]

    tbl_data = [
        [
            Paragraph("No", S["th"]),
            Paragraph("SKU", S["th"]),
            Paragraph("Nama Produk", S["th_l"]),
            Paragraph("Harga Satuan", S["th"]),
            Paragraph("Qty", S["th"]),
            Paragraph("Diskon", S["th"]),
            Paragraph("Subtotal", S["th"]),
        ]
    ]

    for i, (_, row) in enumerate(order_df.iterrows(), 1):
        sku = safe_str(
            get_first_available_value(
                row,
                [cols["sku_induk"], cols["sku"]],
                "-",
            )
        )
        name = safe_str(
            get_first_available_value(row, [cols["product_name"]], "-")
        )
        price = safe_num(
            get_first_available_value(row, [cols["unit_price"]], 0)
        )
        qty = safe_int(
            get_first_available_value(row, [cols["qty"]], 1)
        )
        disc = safe_num(
            get_first_available_value(row, [cols["discount"]], 0)
        )
        subtotal = safe_num(
            get_first_available_value(row, [cols["line_subtotal"]], 0)
        )

        # fallback kalau subtotal item kosong
        if subtotal <= 0 and price > 0 and qty > 0:
            subtotal = (price * qty) - disc

        tbl_data.append(
            [
                Paragraph(str(i), S["td_muted"]),
                Paragraph(sku, S["td_c"]),
                Paragraph(name, S["td"]),
                Paragraph(fmt_rp(price), S["td_r"]),
                Paragraph(str(qty), S["td_c"]),
                Paragraph(fmt_rp(disc) if disc > 0 else "–", S["td_c"]),
                Paragraph(fmt_rp(subtotal), S["td_bold_r"]),
            ]
        )

    tbl_data.append(
        [
            Paragraph("", S["td"]),
            Paragraph("", S["td"]),
            Paragraph("", S["td"]),
            Paragraph("", S["td"]),
            Paragraph("", S["td"]),
            Paragraph("Subtotal", S["td_bold_r"]),
            Paragraph(fmt_rp(grand_total), S["td_bold_r"]),
        ]
    )

    n = len(tbl_data)

    row_bg_styles = []
    for i in range(1, n - 1):
        bg = WHITE if i % 2 == 1 else GRAY_50
        row_bg_styles.append(("BACKGROUND", (0, i), (-1, i), bg))

    tbl = Table(tbl_data, colWidths=col_w, repeatRows=1)
    tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), GRAY_100),
                ("TEXTCOLOR", (0, 0), (-1, 0), GRAY_900),
                ("BACKGROUND", (0, n - 1), (-1, n - 1), GRAY_50),
                ("LINEABOVE", (0, n - 1), (-1, n - 1), 1, GRAY_200),
                ("BOX", (0, 0), (-1, -1), 0.6, GRAY_200),
                ("INNERGRID", (0, 0), (-1, -1), 0.3, GRAY_200),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, 0), 9),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 9),
                ("TOPPADDING", (0, 1), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 1), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("LEFTPADDING", (2, 1), (2, -1), 8),
                ("RIGHTPADDING", (2, 1), (2, -1), 8),
                *row_bg_styles,
            ]
        )
    )

    story.append(tbl)
    story.append(Spacer(1, 5.5 * mm))

    sum_lbl_w = 54 * mm
    sum_val_w = 38 * mm
    sum_total_w = sum_lbl_w + sum_val_w

    total_payment_text = fmt_rp(total_payment).replace("Rp ", "Rp&nbsp;")

    sum_rows = [
        [
            Paragraph("Subtotal Produk", S["sum_lbl"]),
            Paragraph(fmt_rp(grand_total), S["sum_val"]),
        ],
        [
            Paragraph("Ongkos Kirim", S["sum_lbl"]),
            Paragraph(fmt_rp(shipping_est), S["sum_val"]),
        ],
    ]

    if tax > 0:
        sum_rows.append(
            [
                Paragraph("Pajak", S["sum_lbl"]),
                Paragraph(fmt_rp(tax), S["sum_val"]),
            ]
        )

    if voucher > 0:
        sum_rows.append(
            [
                Paragraph("Voucher / Diskon", S["sum_lbl"]),
                Paragraph(f"– {fmt_rp(voucher)}", S["sum_val"]),
            ]
        )

    sum_rows.append(
        [
            Paragraph("Total Pembayaran", S["total_lbl"]),
            Paragraph(total_payment_text, S["total_val"]),
        ]
    )

    sum_tbl = Table(sum_rows, colWidths=[sum_lbl_w, sum_val_w])
    sum_tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -2), WHITE),
                ("BACKGROUND", (0, -1), (-1, -1), GRAY_100),
                ("BOX", (0, 0), (-1, -1), 0.6, GRAY_200),
                ("LINEBELOW", (0, 0), (-1, -2), 0.3, GRAY_200),
                ("TOPPADDING", (0, 0), (-1, -2), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -2), 8),
                ("TOPPADDING", (0, -1), (-1, -1), 10),
                ("BOTTOMPADDING", (0, -1), (-1, -1), 10),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )

    sum_wrap = Table(
        [["", sum_tbl]],
        colWidths=[W - sum_total_w, sum_total_w],
    )
    sum_wrap.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )

    story.append(sum_wrap)
    story.append(Spacer(1, 6.5 * mm))

    note_box = Table(
        [[
            Paragraph(
                "Dokumen ini diterbitkan secara otomatis dan merupakan bukti transaksi yang sah. "
                "Harap simpan untuk keperluan administrasi dan rekonsiliasi pembayaran.",
                S["note"],
            )
        ]],
        colWidths=[W],
    )
    note_box.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.6, GRAY_200),
                ("BACKGROUND", (0, 0), (-1, -1), GRAY_50),
                ("TOPPADDING", (0, 0), (-1, -1), 11),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )

    story.append(note_box)

    return story


# =========================================================
# CONVERTER - FAST VERSION
# =========================================================
def convert_excel_to_single_pdf(
    excel_path,
    output_pdf_path,
    progress_callback=None,
):
    df = read_input_file(excel_path)

    if df.empty:
        raise ValueError("File Excel kosong atau tidak ada data.")

    cols = resolve_columns(df)

    # normalisasi kolom utama
    df[cols["order_no"]] = df[cols["order_no"]].astype(str).str.strip()
    df[cols["invoice_no"]] = df[cols["invoice_no"]].astype(str).str.strip()

    orders = list(df.groupby(cols["order_no"], sort=False))
    total_orders = len(orders)

    if total_orders == 0:
        raise ValueError("Tidak ada data invoice yang ditemukan.")

    output_dir = Path(output_pdf_path).parent
    os.makedirs(output_dir, exist_ok=True)

    cleanup_old_files(output_dir, max_age_hours=24)

    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=A4,
        leftMargin=MARGIN_L,
        rightMargin=MARGIN_R,
        topMargin=MARGIN_T,
        bottomMargin=MARGIN_B,
    )

    styles = make_styles()
    story = []

    for i, (order_no, group) in enumerate(orders, 1):
        invoice_no = safe_str(
            group.iloc[0].get(cols["invoice_no"], f"INV-{i:04d}")
        )

        invoice_story = build_invoice_story(
            group,
            order_no,
            invoice_no,
            styles,
            cols,
        )
        story.extend(invoice_story)

        if i < total_orders:
            story.append(PageBreak())

        if progress_callback:
            progress_callback(i, total_orders, invoice_no)

        print(f"  [{i:3d}/{total_orders}] {invoice_no}")

    doc.build(
        story,
        onFirstPage=draw_page_background,
        onLaterPages=draw_page_background,
    )

    return {
        "output_pdf": output_pdf_path,
        "total_orders": total_orders,
    }


# =========================================================
# ENTRY POINT
# =========================================================
if __name__ == "__main__":
    import sys

    input_file = (
        sys.argv[1]
        if len(sys.argv) > 1
        else "/mnt/user-data/uploads/data_convert_excel_to_pdf.xlsx"
    )
    output_pdf = (
        sys.argv[2]
        if len(sys.argv) > 2
        else str(BASE_DIR / "outputs" / "ALL_INVOICES.pdf")
    )

    result = convert_excel_to_single_pdf(input_file, output_pdf)

    print(
        f"\n  Selesai! {result['total_orders']} invoice -> "
        f"{result['output_pdf']}\n"
    )