import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TextField, Button, CircularProgress, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [targetSize, setTargetSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSizeChange = (event) => {
    setTargetSize(event.target.value);
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    const toastId = toast.loading("Uploading and processing video...");
    setIsLoading(true);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('targetSize', targetSize);

    try {
      const response = await axios.post('https://video-compress-aaom.onrender.com/api/videos/upload', formData);
      toast.update(toastId, { render: "Video uploaded successfully!", type: "success", isLoading: false, autoClose: 5000 });
    } catch (error) {
      toast.update(toastId, { render: "Failed to upload video.", type: "error", isLoading: false, autoClose: 5000 });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      p={2}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Upload Your Video
      </Typography>
      <TextField
        type="file"
        onChange={onFileChange}
        disabled={isLoading}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
      />
    
      <Button
        startIcon={isLoading ? <CircularProgress size={24} /> : <CloudUploadIcon />}
        variant="contained"
        color="primary"
        onClick={onFileUpload}
        disabled={isLoading || !file}
        sx={{ mt: 2 }}
      >
        {isLoading ? 'Uploading...' : 'Upload'}
      </Button>
    </Box>
  );
}

export default UploadForm;
