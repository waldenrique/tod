'use client';

import { useState, useEffect, useRef } from 'react';

export default function Timer() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const updateDisplay = (time: number) => {
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = time % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        if (!isRunning) {
            const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
            if (totalSeconds <= 0) {
                alert('Por favor, insira um tempo válido!');
                return;
            }

            setTimeLeft(totalSeconds);
            setIsRunning(true);

            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setIsRunning(false);
                        audioRef.current?.play();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setIsRunning(false);
    };

    const resetTimer = () => {
        stopTimer();
        setTimeLeft(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Cronômetro com Alarme</h1>
            
            <div className="flex gap-2 justify-center mb-6">
                <input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-20 p-2 text-xl text-center border rounded"
                    placeholder="Horas"
                />
                <span className="text-2xl">:</span>
                <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-20 p-2 text-xl text-center border rounded"
                    placeholder="Min"
                />
                <span className="text-2xl">:</span>
                <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-20 p-2 text-xl text-center border rounded"
                    placeholder="Seg"
                />
            </div>

            <div className="flex gap-4 justify-center mb-6">
                <button
                    onClick={startTimer}
                    disabled={isRunning}
                    className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                    Iniciar
                </button>
                <button
                    onClick={stopTimer}
                    className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Parar
                </button>
                <button
                    onClick={resetTimer}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Reiniciar
                </button>
            </div>

            <div className="text-5xl font-bold text-gray-800">
                {updateDisplay(timeLeft)}
            </div>

            <audio ref={audioRef} src="/alarm.mp3" />
        </div>
    );
}