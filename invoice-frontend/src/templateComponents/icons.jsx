import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'

function createIconComponent(IconComponent) {
  return function WrappedIcon({ size = 20, className, style, ...props }) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          lineHeight: 0,
          ...style,
        }}
      >
        <IconComponent sx={{ fontSize: size, display: 'block' }} {...props} />
      </span>
    )
  }
}

export const BarChartSquare02 = createIconComponent(BarChartRoundedIcon)
export const ArrowLeft = createIconComponent(ArrowBackRoundedIcon)
export const Bell04 = createIconComponent(NotificationsNoneRoundedIcon)
export const ChevronDown = createIconComponent(KeyboardArrowDownRoundedIcon)
export const ChevronLeft = createIconComponent(ChevronLeftRoundedIcon)
export const ChevronRight = createIconComponent(ChevronRightRoundedIcon)
export const LogOut01 = createIconComponent(LogoutRoundedIcon)
export const Menu01 = createIconComponent(MenuRoundedIcon)
export const RefreshCw05 = createIconComponent(RefreshRoundedIcon)
export const SearchMd = createIconComponent(SearchRoundedIcon)
export const XClose = createIconComponent(CloseRoundedIcon)
export const CloudUpload = createIconComponent(CloudUploadRoundedIcon)
export const FileText01 = createIconComponent(InsertDriveFileRoundedIcon)
export const CheckCircle = createIconComponent(CheckCircleRoundedIcon)
export const AlertCircle = createIconComponent(ErrorOutlineRoundedIcon)
export const Download01 = createIconComponent(DownloadRoundedIcon)
export const Eye = createIconComponent(VisibilityRoundedIcon)
export const FolderOpen = createIconComponent(FolderOpenRoundedIcon)
export const PlayArrow = createIconComponent(PlayArrowRoundedIcon)
