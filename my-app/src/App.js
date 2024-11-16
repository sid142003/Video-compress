import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import VideoList from './components/VideoList';
import { ToastContainer } from 'react-toastify';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function App() {
    return (
        <Router>
            <Box className="App">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Video Compression Service
                        </Typography>
                      
                        <Button color="inherit" component={NavLink} to="/upload">
                            Upload Video
                        </Button>
                        <Button color="inherit" component={NavLink} to="/videos">
                            Video List
                        </Button>
                    </Toolbar>
                </AppBar>

               
                    <Routes>
                       
                        <Route path="/upload" element={<UploadForm />} />
                        <Route path="/videos" element={<VideoList />} />
                    </Routes>
                

                <ToastContainer />
            </Box>
        </Router>
    );
}

export default App;
