import { Button, Card, InputAdornment, OutlinedInput, Tooltip } from '@mui/material';
import { CustomPopOver } from './custom-popover';
import { usePopover } from '../hooks/use-popover';
import { SearchOutlined } from '@ant-design/icons';

export const CustomSearch = ({
  popoverItems,
  handleSearch,
  exportExcel,
  getDataForExportExcel,
}) => {
  const popOver = usePopover();

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'sticky',
        top: 92,
        zIndex: 999,
        p: 2,
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      <CustomPopOver
        id={popOver.id}
        anchorEl={popOver.anchorRef}
        open={popOver.open}
        onClose={popOver.handleClose}
        popoverItems={popoverItems}
      />
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search"
        startAdornment={(
          <InputAdornment position="start">
            <SearchOutlined />
          </InputAdornment>
        )}
        sx={{ maxWidth: 500, mr: "auto" }}
        onChange={(event) => handleSearch && handleSearch(event)}
      />
      {getDataForExportExcel &&
        <>
          <Tooltip title={'Download excel'}>
            <Button
              variant='outlined'
              disabled={exportExcel}
              sx={{ mr: 2 }}
              onClick={() => {
                getDataForExportExcel()
              }}
            >
              {exportExcel ? "Exporting..." : "Download Excel"}
            </Button>
          </Tooltip>
        </>
      }
    </Card>
  );
}
