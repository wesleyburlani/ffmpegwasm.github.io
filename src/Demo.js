import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {
  LiveProvider,
  LiveError,
  LivePreview,
} from 'react-live';
import vsDark from 'prism-react-renderer/themes/vsDark';
import FFmpeg from './components/FFmpeg';


const CONFIGS = {
  x264: `
{
  args: [],
  inFilename: '',
  outFilename: '',
  mediaType: 'video/mp4',
}`.trim('\n'),
};

// const CODEPENS = [
//   {
//     title: 'WebCam',
//     url: 'https://codepen.io/jeromewu/details/qBBKzyW',
//   },
//   {
//     title: 'To x264 mp4',
//     url: 'https://codepen.io/jeromewu/pen/NWWaMeY',
//   },
// ];

const useStyles = makeStyles({
  root: {
    margin: '48px 0px 48px 0px',
  },
  para: {
    margin: '16px 0px 24px 0px',
  },
});

function Demo() {
  const classes = useStyles();
  const [config, _] = useState('x264');
  const IS_COMPATIBLE = typeof SharedArrayBuffer === 'function';
  return (
    <Grid className={classes.root} container direction="column" >
      <Typography align="center" variant="h4">
        Demo
      </Typography>
      <Typography className={classes.para} align="center" variant="h6">
        Try ffmpeg.wasm now!
      </Typography>
      {
        !IS_COMPATIBLE ? (
          <>
            <Typography align="center" variant="h6">
              Your browser doesn't support SharedArrayBuffer, thus ffmpeg.wasm cannot execute. Please use latest version of Chromium or any other browser supports SharedArrayBuffer.
            </Typography>
          </>
        ) : (
          <>
            <LiveProvider
              theme={vsDark}
              code={CONFIGS[config]}
              scope={{ FFmpeg }}
              transformCode={(code) => (
                `() => { const props=${code}; return <FFmpeg {...props} />;}`
              )}
            >
              <LivePreview />
              <LiveError />
            </LiveProvider>
          </>
        )
      }
      {/*
      <Typography className={classes.para} align="center" variant="h6">
        Live Demo on CodePen
      </Typography>
      <Grid container justify="center" spacing={2}>
        {
          CODEPENS.map(({ title, url }) => (
            <Grid item key={url}>
              <DemoLinkCard
                img={codepen}
                title={title}
                url={url}
              />
            </Grid>
          ))
        }
      </Grid>
      */}
    </Grid>
  );
}

export default Demo;
