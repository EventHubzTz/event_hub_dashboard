import PropTypes from 'prop-types'
import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material"
import { visuallyHidden } from '@mui/utils';

export const EnhancedTableHead = (props) => {
    const {
        headCells,
        selectedSome,
        selectedAll,
        onSelectAll,
        onDeselectAll,
        order,
        orderBy,
        onRequestSort
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {onSelectAll &&
                    <TableCell padding="checkbox">
                        <Checkbox
                            checked={selectedAll}
                            indeterminate={selectedSome}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    onSelectAll?.();
                                } else {
                                    onDeselectAll?.();
                                }
                            }}
                        />
                    </TableCell>
                }
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

EnhancedTableHead.propTypes = {
    headCells: PropTypes.array.isRequired,
}