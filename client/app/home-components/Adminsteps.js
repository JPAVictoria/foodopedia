'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/system';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';

import LooksOneRoundedIcon from '@mui/icons-material/LooksOneRounded';
import LooksTwoRoundedIcon from '@mui/icons-material/LooksTwoRounded';
import Looks3RoundedIcon from '@mui/icons-material/Looks3Rounded';
import Looks4RoundedIcon from '@mui/icons-material/Looks4Rounded';
import Looks5RoundedIcon from '@mui/icons-material/Looks5Rounded';
import Looks6RoundedIcon from '@mui/icons-material/Looks6Rounded';

const adminitems = [
  {
    icon: <LooksOneRoundedIcon />,
    title: 'Navigate',
    description: (
      <>
        Begin by accessing the <b>Contents</b> page from your admin dashboard. Our product effortlessly adjusts to your needs, boosting <strong>efficiency</strong> and simplifying your tasks.
      </>
    ),
  },
  {
    icon: <LooksTwoRoundedIcon />,
    title: 'Create',
    description: (
      <>
        Click the <strong>create</strong> button to start a new post. 
      </>
    ),
  },
  {
    icon: <Looks3RoundedIcon />,
    title: 'Enter Details',
    description: (
      <>
        Fill in all required fields, including title, description, category, and any relevant tags.
      </>
    ),
  },
  {
    icon: <Looks4RoundedIcon />,
    title: 'Add Image',
    description: (
      <>
        To include an image, paste the <strong>web address (URL)</strong> of an existing image hosted online. Make sure the link is publicly accessible.
      </>
    ),
  },
  {
    icon: <Looks5RoundedIcon />,
    title: 'Publish or Save as Draft',
    description: (
      <>
        
            o	To make the post visible on the <strong>viewer side</strong>, select <strong>Publish</strong>.<br></br>
            o	To keep the post private for now, choose <strong>Save as Draft</strong>.
        
      </>
    ),
  },
  {
    icon: <Looks6RoundedIcon />,
    title: 'Monitor Engagement',
    description: (
      <>
        To review viewer feedback and ratings, navigate to the <strong>Admin Dashboard</strong> where real-time insights are available.
      </>
    ),
  },
];


export default function Adminsteps() {
   const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'text.primary',
        // bgcolor: 'grey.900',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Admin Guide: How to Publish Content
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Easily manage and share your food-related content using our streamlined publishing system. 
            Follow these simple steps to get your content from draft to live in minutes.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {adminitems.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: 'text.secondary',
                  backgroundColor: 'mode.primary',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
