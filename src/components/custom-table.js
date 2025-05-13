import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Scrollbar } from './scrollbar';
import { EnhancedTableHead } from './enhanced-table-head';
import { usePopover } from '../hooks/use-popover';
import { CustomPopOver } from './custom-popover';
import { IOSSwitch } from './IOSSwitch';
import { convertTime } from '../utils/convert-timestamp';
import { formatDate } from '../utils/date-formatter';
import { MoreOutlined } from '@ant-design/icons';
import { formatMoney } from '../utils/constant';

export const CustomTable = (props) => {
  const {
    order,
    orderBy,
    onRequestSort,
    count = 0,
    items = [],
    onPageChange = () => { },
    onRowsPerPageChange,
    onSelectOne,
    onSelect,
    onSelectAll,
    onDeselectOne,
    onDeselectAll,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    headCells,
    popoverItems,
    isLoading,
    switchFunction,
    isSubmitting,
  } = props;
  const popOver = usePopover();
  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  return (
    <>
      {popOver.open &&
        <CustomPopOver
          id={popOver.id}
          anchorEl={popOver.anchorRef}
          open={popOver.open}
          onClose={popOver.handleClose}
          popoverItems={popoverItems}
        />
      }
      <Card
        variant="outlined"
      >
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table
              sx={{
                '& th, & td': {
                  borderBottom: 'none',
                },
              }}
            >
              <EnhancedTableHead
                headCells={headCells}
                selectedSome={selectedSome}
                selectedAll={selectedAll}
                onSelectAll={onSelectAll}
                onDeselectAll={onDeselectAll}
                order={order}
                orderBy={orderBy}
                onRequestSort={onRequestSort}
              />
              <TableBody>
                {items.map((row, index) => {
                  const isSelected = selected.includes(row.id);

                  return (
                    <TableRow
                      hover
                      key={index}
                      selected={isSelected}
                      sx={{
                        cursor: 'pointer'
                      }}
                      onClick={(event) => {
                        event.stopPropagation()
                        onSelect(row, true);
                      }}
                    >
                      {onSelectAll &&
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onClick={(event) => {
                              event.stopPropagation()
                            }}
                            onChange={(event) => {
                              if (event.target.checked) {
                                onSelectOne?.(row.id);
                              } else {
                                onDeselectOne?.(row.id);
                              }
                            }}
                          />
                        </TableCell>
                      }
                      {headCells
                        .map((column, index) => {
                          if (column.id === 'name') {
                            return (
                              <TableCell
                                key={index}
                              >
                                <Stack
                                  alignItems="center"
                                  direction="row"
                                  spacing={2}
                                >
                                  <Typography variant="subtitle2">
                                    {row.first_name && `${row.first_name} ${row.last_name}`}
                                    {row.firstName && `${row.firstName} ${row.secondName}`}
                                  </Typography>
                                </Stack>
                              </TableCell>
                            )
                          } else if (column.id === 'event_category_color') {
                            return (
                              <TableCell key={index}>
                                <Avatar
                                  variant='rounded'
                                  sx={{ bgcolor: row?.event_category_color || row?.service_color || row?.color }}
                                  src={row.icon_url || row?.image_url || row?.icon}
                                />
                              </TableCell>
                            )
                          } else if (column.id === 'icon' || column.id === 'image_url') {
                            return (
                              <TableCell
                                key={index}
                              >
                                <Avatar
                                  variant='rounded'
                                  alt="Preview Picture"
                                  src={row.icon_url || row.image_url || row.image_url || row.icon}
                                />
                              </TableCell>
                            )
                          } else if (column.id === 'profile_image') {
                            return (
                              <TableCell
                                key={index}
                              >
                                <Avatar
                                  variant='rounded'
                                  alt="Profile Picture"
                                  src={row.doc_profile_image || row.profileImage || row.icon}
                                />
                              </TableCell>
                            )
                          } else if (column.id === 'switch') {
                            return (
                              <TableCell key={index}>
                                {isSubmitting && selected[0]?.id === row.id ?
                                  <CircularProgress
                                    size={26}
                                  /> :
                                  <IOSSwitch
                                    checked={row.active}
                                    onChange={() => switchFunction(row)}
                                  />
                                }
                              </TableCell>
                            )
                          } else if (column.id === 'location') {
                            return (
                              <TableCell key={index}>
                                {row.region} {row.location && row.location}
                              </TableCell>
                            )
                          } else if (column.id === 'payment_status') {
                            return (
                              <TableCell key={index}>
                                <Chip
                                  color={row.status === "COMPLETED" ||
                                    row.payment_status === "COMPLETED" ? "success" : "error"
                                  }
                                  label={row.payment_status === "COMPLETED" || (row.total_completed_amount > 0 && row.total_completed_amount >= (row.product_amount + row.shipping_cost)) ?
                                    "COMPLETED" :
                                    row.total_completed_amount > 0 ?
                                      "INCOMPLETE" :
                                      row.payment_status
                                  }
                                  sx={{
                                    width: 110,
                                    color: 'black',
                                  }}
                                />
                              </TableCell>
                            )
                          } else if (column.id === 'placed_at') {
                            return (
                              <TableCell key={index}>
                                {formatDate(row.created_date)}
                              </TableCell>
                            )
                          } else if (column.id === 'amount' || column.id === 'debit' || column.id === 'credit' || column.id === 'balance') {
                            return (
                              <TableCell key={index}>
                                {formatMoney(row[column.id])}
                              </TableCell>
                            )
                          } else if (column.id === 'actions') {
                            return (
                              <TableCell key={index}>
                                <IconButton
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    popOver.handleOpen(event)
                                    onSelect(row, false)
                                  }}
                                  sx={{
                                    color: "black",
                                    fontSize: "30px"
                                  }}
                                >
                                  <MoreOutlined />
                                </IconButton>
                              </TableCell>
                            )
                          } else {
                            return (
                              <TableCell key={column.id}>
                                {column.id === 'notification_interval' ? convertTime(row[column.id]) : row[column.id]}
                              </TableCell>
                            )
                          }
                        })
                      }
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        {items.length === 0 && isLoading &&
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <CircularProgress
              sx={{
                mx: 'auto',
                my: 3,
              }}
            />
          </Box>
        }
        {items.length === 0 && !isLoading &&
          <Typography
            sx={{ my: 3, }}
            align='center'
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            No items
          </Typography>
        }
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </Card>
    </>
  );
};

CustomTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectOne: PropTypes.func,
  onSelect: PropTypes.func,
  onSelectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onDeselectAll: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  headCells: PropTypes.array.isRequired,
};
