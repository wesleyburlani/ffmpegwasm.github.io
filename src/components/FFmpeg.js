
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
let ffmpeg = null;

const useStyles = makeStyles({
  root: {
    margin: '48px 0px 48px 0px',
  },
  progress: {
    width: '100%',
  },
});

const readFromBlobOrFile = (blob) => (
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = ({ target: { error: { code } } }) => {
      reject(Error(`File could not be read! Code=${code}`));
    };
    fileReader.readAsArrayBuffer(blob);
  })
);

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="static" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function FFmpeg({ args, inFilename, outFilename, mediaType }) {
  const classes = useStyles();
  const [videoSrc, setVideoSrc] = useState('');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (ffmpeg === null) {
      ffmpeg = createFFmpeg({
        log: true,
        corePath: './static/js/ffmpeg-core.js',
        // corePath: 'https://unpkg.com/@ffmpeg/core@0.8.3/dist/ffmpeg-core.js',
      });
    }
    ffmpeg.setLogger(({ type, message }) => {
      if (type !== 'info') {
        setMessage(message);
      }
    });
    ffmpeg.setProgress(({ ratio }) => {
      if (ratio >= 0 && ratio <= 1) {
        setProgress(ratio * 100);
      }
      if (ratio === 1) {
        setTimeout(() => { setProgress(0); }, 1000);
      }
    });
  });
  const onFilesUploaded = async ({ target: { files } }) => {
    const inputPaths = [];
    await ffmpeg.load();
    for (const file of files) {
      const { name } = file;
      ffmpeg.FS('writeFile', name, await fetchFile(file));
      inputPaths.push(`file ${name}`);
    }
    ffmpeg.FS('writeFile', 'concat_list.txt', inputPaths.join('\n'));
    await ffmpeg.run('-f', 'concat', '-safe', '0', '-i', 'concat_list.txt',  '-c', 'copy','./output.mp4');
    const data = ffmpeg.FS('readFile', './output.mp4');
    const a = document.createElement('a');
    var url = window.URL.createObjectURL(new Blob([data], {type: "video/mp4"}));
    a.href = url;
    a.download = "meeting.mp4";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };
  return (
    <Grid className={classes.root} container direction="column" alignItems="center" spacing={2}>
      {videoSrc.length === 0 ? null : (
        <Grid item>
          <video src={videoSrc} autoPlay controls></video>,
        </Grid>
      )}
      <Grid item>
        {progress !== 0 ? (
          <CircularProgressWithLabel
            variant="static"
            color="secondary"
            value={progress}
          />
        ) : (
          <Button
            variant="contained"
            component="label"
            color="secondary"
          >
            Upload a Video/Audio File
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={onFilesUploaded}
              multiple
            />
          </Button>
        )}
      </Grid>
      <Grid item>
        <Typography align="center">
          {`$ ffmpeg ${args.join(' ')}`}
        </Typography>
      </Grid>
      <Grid item>
        <Typography align="center">
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default FFmpeg;
