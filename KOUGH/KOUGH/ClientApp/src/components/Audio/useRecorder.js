import { useState, useEffect } from "react";

const initialState = {
  recordingMinutes: 0,
  recordingSeconds: 0,
  isRecording: false,
  mediaStream: null,
  mediaRecorder: null,
  audio: null,
}

const useRecorder = () => {
  const [recorderState, setRecorderState] = 
    useState(initialState);

  const startRecording = async (setRecorderState) => {
    try {
      // get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
      setRecorderState((prevState) => {
        return {
          ...prevState,
          isRecording: true,
          mediaStream: stream,
        };
      });
    } catch (err) {
      console.log(err);
    }
  }
  
  const saveRecording = (recorder) => {
    if (recorder.state !== "inactive") {
      recorder.stop();
    }
  }

  useEffect(() => {
    const MAX_RECORDER_TIME = 1; //   update -> 10 to 1
    let recordingInterval = null;

    if (recorderState.isRecording)
      recordingInterval = setInterval(() => {
        setRecorderState((prevState) => {
          if (prevState.recordingMinutes === MAX_RECORDER_TIME &&
              prevState.recordingSeconds === 0) 
          {
            clearInterval(recordingInterval);
            return prevState;
          }

          if (prevState.recordingSeconds >= 0 && 
              prevState.recordingSeconds < 59) {
            return {
              ...prevState,
              recordingSeconds: prevState.recordingSeconds + 1,
            };
          }

          if (prevState.recordingSeconds === 59)
          {
            return {
            ...prevState,
            recordingMinutes: prevState.recordingMinutes + 1,
            recordingSeconds: 0,
            };
          }
        });
      }, 1000);
    else 
    {
      clearInterval(recordingInterval);
    }

    return () => clearInterval(recordingInterval);
  });

  useEffect(() => {
    if (recorderState.mediaStream)
      setRecorderState((prevState) => {
        return {
          ...prevState,
          mediaRecorder: new MediaRecorder(prevState.mediaStream),
        };
      });
  }, [recorderState.mediaStream]);

  useEffect(() => {
    const recorder = recorderState.mediaRecorder;
    let chunks = [];

    if (recorder && recorder.state === "inactive") {
      recorder.start();

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];

        setRecorderState((prevState) => {
          if (prevState.mediaRecorder)
            return {
              ...initialState,
              audio: window.URL.createObjectURL(blob),
            };
          else return initialState;
        });
      };
    }

    return () => {
      if (recorder) {
        recorder
          .stream
            .getAudioTracks()
            .forEach((track) => track.stop());
      }
    };
  }, [recorderState.mediaRecorder]);

  return {
    recorderState,
    startRecording: () => startRecording(setRecorderState),
    cancelRecording: () => setRecorderState(initialState),
    saveRecording: () => saveRecording(recorderState.mediaRecorder),
  };
}

export default useRecorder;
