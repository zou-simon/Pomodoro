import './App.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';

function App() {

  const DEFAULT_MINUTES_WORK = 1;
  const DEFAULT_SECONDS_WORK = 0;
  const DEFAULT_MINUTES_PAUSE = 1;
  const DEFAULT_SECONDS_PAUSE = 0;

  const [inputMinutesWork, setInputMinutesWork] = useState(DEFAULT_MINUTES_WORK);
  const [inputSecondsWork, setInputSecondsWork] = useState(DEFAULT_SECONDS_WORK);
  const [inputMinutesPause, setInputMinutesPause] = useState(DEFAULT_MINUTES_PAUSE);
  const [inputSecondsPause, setInputSecondsPause] = useState(DEFAULT_SECONDS_PAUSE);

  const [minutes, setMinutes] = useState(inputMinutesWork);
  const [seconds, setSeconds] = useState(inputSecondsWork);
  const [isWork, setIsWork] = useState(true);
  const [isStart, setIsStart] = useState(false);

  const timerMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timerSeconds = seconds < 10 ? `0${seconds}` : seconds;

  const interval = useRef();

  // Check if input are not null and set time for work
  const setWorkTime = useCallback(() => {
    if (inputMinutesWork !== "" && inputSecondsWork !== "") { // If minutes and seconds not null
      setMinutes(inputMinutesWork);
      setSeconds(inputSecondsWork);
    } else if (inputMinutesWork !== 0 && inputMinutesWork !== "" && inputSecondsWork === "") { // If seconds null but not minutes
      setMinutes(inputMinutesWork);
      setSeconds(0);
    } else if (inputMinutesWork === "" && inputSecondsWork !== 0 && inputSecondsWork !== "") { // If minutes null but not seconds
      setMinutes(0);
      setSeconds(inputSecondsWork);
    } else { // If all null, set default time
      setMinutes(DEFAULT_MINUTES_WORK);
      setSeconds(DEFAULT_SECONDS_WORK);
    }
  }, [inputMinutesWork, inputSecondsWork]);

  // Check if input are not null and set time for pause
  const setPauseTime = useCallback(() => {
    if (inputMinutesPause !== "" && inputSecondsPause !== "") { // If minutes and seconds not null
      setMinutes(inputMinutesPause);
      setSeconds(inputSecondsPause);
    } else if (inputMinutesPause !== 0 && inputMinutesPause !== "" && inputSecondsPause === "") { // If seconds null but not minutes
      setMinutes(inputMinutesPause);
      setSeconds(0);
    } else if (inputMinutesPause === "" && inputSecondsPause !== 0 && inputSecondsPause !== "") { // If minutes null but not seconds
      setMinutes(0);
      setSeconds(inputSecondsPause);
    } else { // If all null, set default time
      setMinutes(DEFAULT_MINUTES_PAUSE);
      setSeconds(DEFAULT_SECONDS_PAUSE);
    }
  }, [inputMinutesPause, inputSecondsPause]);

  useEffect(() => {
    if (isStart) {
      clearInterval(interval.current);
      interval.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            if (isWork) {
              setPauseTime();
              setIsWork(false);
            } else {
              setWorkTime();
              setIsWork(true);
            }
            alert('Changement de tâche ! Il faut ' + (!isWork ? 'travailler' : 'faire une pause') + '.');
          } else if (minutes > 0) {
            setSeconds(59);
            setMinutes(minutes => minutes - 1);
          }
        } else if (seconds > 0) {
          setSeconds(seconds => seconds - 1);
        }
      }, 1000);
    }
  }, [minutes, seconds, isStart, isWork, setPauseTime, setWorkTime]);

  // Stop timer
  const stop = () => {
    if (isStart) {
      clearInterval(interval.current);
      setIsStart(false);
    }
  }

  // Reset timer
  const reset = () => {
    clearInterval(interval.current);
    setIsStart(false);
    setWorkTime();
    setIsWork(true);
  }

  return (
    <div className="App">
      <h1 style={{color: isWork ? 'green' : 'red'}}>{isWork ? 'Travail' : 'Pause'}</h1>

      <span style={{color: minutes <= 0 && seconds <= 20 ? 'red' : 'black', fontFamily: 'monospace', fontSize: '50px'}}>{timerMinutes} : {timerSeconds}</span>

      <div>
        <button style={{backgroundColor: 'green'}} onClick={() => setIsStart(true)}>Start</button>
        <button style={{backgroundColor: 'red'}} onClick={stop}>Stop</button>
        <button style={{backgroundColor: 'blue'}} onClick={reset}>Reset</button>
      </div>

      <div>
        <p>Temps pour le travail</p>
        <input type="number" value={inputMinutesWork} onInput={e => setInputMinutesWork(e.target.value < 0 ?  0 : e.target.value)} />
        :
        <input type="number" value={inputSecondsWork} onInput={e => setInputSecondsWork(e.target.value < 0 ?  0 : e.target.value)} />
      </div>

      <div>
        <p>Temps pour la pause</p>
        <input type="number" value={inputMinutesPause} onInput={e => setInputMinutesPause(e.target.value < 0 ?  0 : e.target.value)} />
        :
        <input type="number" value={inputSecondsPause} onInput={e => setInputSecondsPause(e.target.value < 0 ?  0 : e.target.value)} />
      </div>
      
    </div>
  );
}

export default App;
