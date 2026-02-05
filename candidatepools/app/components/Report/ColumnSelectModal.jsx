import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Stack,
  Typography,
  Divider,
} from "@mui/material";

/**
 * ColumnSelectModal
 */
const ColumnSelectModal = ({
  open,
  onClose,
  columns = [],
  initialSelected = [],
  onConfirm,
}) => {
  const [selectedColumns, setSelectedColumns] = useState([]);

  useEffect(() => {
    if (open) {
      setSelectedColumns(initialSelected);
    }
  }, [open, initialSelected]);

  const allIds = columns.map((c) => c.id);
  const allSelected = selectedColumns.length === allIds.length && allIds.length > 0;
  const indeterminate =
    selectedColumns.length > 0 && selectedColumns.length < allIds.length;

  const handleToggle = (id) => {
    setSelectedColumns((prev) =>
      prev.includes(id)
        ? prev.filter((colId) => colId !== id)
        : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    setSelectedColumns(allSelected ? [] : allIds);
  };

  const handleConfirm = () => {
    onConfirm(selectedColumns);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <p>
          เลือกคอลัมน์สำหรับ Export
        </p>
        <p style={{ fontSize: 14, color: "#666" }}>
          เลือกข้อมูลที่ต้องการแสดงในไฟล์รายงาน
        </p>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        {/* Select all */}
        <FormControlLabel
          control={
            <Checkbox
              checked={allSelected}
              indeterminate={indeterminate}
              onChange={handleToggleAll}
            />
          }
          label={
            <Typography fontWeight={500}>
              เลือกทั้งหมด
            </Typography>
          }
        />

        <Divider sx={{ my: 1 }} />

        {/* Column list */}
        <Box
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            pr: 1,
          }}
        >
          <FormGroup>
            {columns.map((col, idx) => (
              <FormControlLabel
                key={col.id + '-' + idx}
                control={
                  <Checkbox
                    checked={selectedColumns.includes(col.id)}
                    onChange={() => handleToggle(col.id)}
                  />
                }
                label={col.label}
              />
            ))}
          </FormGroup>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button onClick={onClose} color="inherit">
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={selectedColumns.length === 0}
          >
            ยืนยัน ({selectedColumns.length})
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnSelectModal;