import React, { useState, useEffect } from "react";
import { AppBar, Box, Stack, Toolbar, Typography } from "@mui/material";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

export default function Layout({ children }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const dateShort = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const dayShort = now.toLocaleDateString("id-ID", { weekday: "short" });
  const dayNum = now.getDate();
  const monthShort = now.toLocaleDateString("id-ID", { month: "short" });

  const CalendarPill = ({
    dateSize,
    monthSize,
    timeSize,
    subSize,
    px,
    py,
    minW,
    borderRadius,
    showFull,
  }) => (
    <Stack
      direction="row"
      alignItems="stretch"
      sx={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          background: "rgba(255,255,255,0.12)",
          borderRight: "1px solid rgba(255,255,255,0.10)",
          px,
          py,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minWidth: minW,
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 800,
            fontSize: dateSize,
            lineHeight: 1,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {dayNum}
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.50)",
            fontWeight: 600,
            fontSize: monthSize,
            letterSpacing: "0.10em",
            mt: "2px",
            fontFamily: "'DM Sans', sans-serif",
            textTransform: "uppercase",
          }}
        >
          {monthShort}
        </Typography>
      </Box>
      <Box
        sx={{
          px,
          py,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontSize: timeSize,
            lineHeight: 1,
            fontFamily: "'DM Mono', 'Courier New', monospace",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          {showFull ? timeStr : timeStr.slice(0, 5)}
        </Typography>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.40)",
            fontSize: subSize,
            mt: "3px",
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {showFull ? dateStr : `${dayShort}, ${dateShort}`}
        </Typography>
      </Box>
    </Stack>
  );

  const BackToPilarButton = ({
    height,
    px,
    borderRadius,
    fontSize,
    iconSize,
    showSubtext = false,
  }) => (
    <Stack
      component="a"
      href="https://pilargroup.id"
      target="_blank"
      rel="noopener noreferrer"
      direction="row"
      alignItems="center"
      spacing={0.9}
      sx={{
        textDecoration: "none",
        height,
        px,
        borderRadius,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.18)",
        transition: "all 0.2s ease",
        "&:hover": {
          background: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.28)",
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box
        sx={{
          width: iconSize + 10,
          height: iconSize + 10,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ArrowBackRoundedIcon sx={{ color: "#fff", fontSize: iconSize }} />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontSize,
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "nowrap",
            lineHeight: 1.1,
          }}
        >
          Back to Pilar
        </Typography>

        {showSubtext && (
          <Typography
            sx={{
              color: "rgba(255,255,255,0.45)",
              fontWeight: 600,
              fontSize: "9px",
              letterSpacing: "0.08em",
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: "nowrap",
              mt: "2px",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            pilargroup.id
          </Typography>
        )}
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: 1100,
          background: "#233971",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "none",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: "68px", sm: "72px" },
            px: { xs: "16px", sm: "24px", md: "32px" },
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              zIndex: 1,
            }}
          >
            <Box
              component="img"
              src="/logo.svg"
              alt="Logo"
              sx={{
                height: { xs: 48, sm: 50, md: 58 },
                width: "auto",
                maxWidth: { xs: 160, sm: 180, md: 230 },
                objectFit: "contain",
                display: "block",
              }}
            />
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              display: { xs: "none", sm: "flex" },
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 0,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: { sm: 34, md: 38 },
                height: { sm: 34, md: 38 },
                borderRadius: "10px",
                background: "rgba(255,255,255,0.11)",
                border: "1px solid rgba(255,255,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ReceiptLongRoundedIcon
                sx={{ color: "#fff", fontSize: { sm: 16, md: 18 } }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: { sm: "15px", md: "17px" },
                  lineHeight: 1.1,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "-0.4px",
                  whiteSpace: "nowrap",
                }}
              >
                Invoice Generator
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.40)",
                  fontWeight: 600,
                  fontSize: "10px",
                  letterSpacing: "0.16em",
                  mt: "2px",
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                WORKSPACE
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ flexShrink: 0, zIndex: 1 }}
          >
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <CalendarPill
                dateSize="20px"
                monthSize="9px"
                timeSize="15px"
                subSize="11px"
                px="13px"
                py="8px"
                minW="46px"
                borderRadius="12px"
                showFull
              />
            </Box>

            <Box sx={{ display: { xs: "none", sm: "block", md: "none" } }}>
              <CalendarPill
                dateSize="17px"
                monthSize="8px"
                timeSize="13px"
                subSize="10px"
                px="11px"
                py="7px"
                minW="40px"
                borderRadius="10px"
                showFull={false}
              />
            </Box>

            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <BackToPilarButton
                height="38px"
                px="12px"
                borderRadius="10px"
                fontSize="12px"
                iconSize={16}
                showSubtext={false}
              />
            </Box>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <BackToPilarButton
                height={{ sm: "36px", md: "40px" }}
                px={{ sm: "12px", md: "14px" }}
                borderRadius="10px"
                fontSize={{ sm: "10px", md: "11px" }}
                iconSize={16}
                showSubtext={false}
              />
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: "100%" }}>{children}</Box>
    </Box>
  );
}