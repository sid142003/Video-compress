import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, CardContent, Typography, Button, Grid, Box, Chip } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ErrorIcon from '@mui/icons-material/Error';

const VideoList = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/videos');
                console.log(response.data);
                setVideos(response.data);
            } catch (error) {
                toast.error(`Failed to fetch videos: ${error.message}`);
                console.error(error);
            }
        };

        fetchVideos();
    }, []);

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Video List
            </Typography>
            <Grid container spacing={2}>
                {videos.map(video => (
                    <Grid item xs={12} md={6} lg={4} key={video._id}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    {video.filename}
                                </Typography>
                                <Typography color="textSecondary">
                                    Size: {(video.size / 1024 / 1024).toFixed(2)} MB
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    {video.isCompressed ? (
                                        <Chip icon={<CheckBoxIcon />} label="Compressed" color="success" />
                                    ) : (
                                        <Chip icon={<ErrorIcon />} label="Not Compressed" color="error" />
                                    )}
                                </Typography>
                                <Box sx={{ margin: '12px 0' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        href={video.originalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ marginRight: '10px' }}
                                    >
                                        Download Original
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        href={video.compressedUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Download Compressed
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default VideoList;
