import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import SkeletonLoader from "./SkeletonLoader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const TaskPage = () => {
  const [info, setInfo] = useState({
    isRecording: false,
    loading: false,
    recognition: null,
  });
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (speechRecognition) {
      const recognition = new speechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleApiCall(transcript);
        setInfo((prev) => ({ ...prev, isRecording: false }));
      };
      recognition.onerror = (event) => {
        setInfo((prev) => ({ ...prev, isRecording: false }));
      };
      setInfo((prev) => ({ ...prev, recognition }));
    }
  }, []);

  const handleMicClick = useCallback(() => {
    if (!info?.recognition) {
      return console.log("Not supported");
    }

    if (info.isRecording) {
      info.recognition.stop();
      setInfo((prev) => ({ ...prev, isRecording: false }));
    } else {
      info.recognition.start();
      setInfo((prev) => ({ ...prev, isRecording: true }));
    }
  }, [info]);

  const handleApiCall = useCallback(async (voiceText) => {
    const payload = { voiceText };
    const responce = await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}/task/CreateTask`,
      payload,
    );
    handleFetchApi();
  }, []);

  async function handleFetchApi() {
    try {
      setInfo((prev) => ({ ...prev, loading: true }));
      const responce = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/task/fetchtask`,
      );

      setTasks(responce?.data?.task);
    } catch (err) {
      console.log("Error ==> handleFetchApi", err);
    } finally {
      setInfo((prev) => ({ ...prev, loading: false }));
    }
  }

  useEffect(() => {
    handleFetchApi();
  }, []);

  const handleDeleteTask = async (TaskID) => {
    console.log(TaskID);
    await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/task/DeleteTask/${TaskID}`)
    handleFetchApi();
  };
  
  return (
    <div>
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
        <div className="relative flex min-h-screen w-full flex-col max-w-[480px] mx-auto bg-background-light dark:bg-background-dark overflow-x-hidden border-x border-slate-200 dark:border-slate-800">
          {/* <!-- Header Section --> */}
          <div className="flex items-center bg-white dark:bg-slate-900/50 p-4 pb-2 justify-between sticky top-0 z-10 backdrop-blur-md">
            <div className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center justify-start">
              <span className="material-symbols-outlined text-2xl">menu</span>
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
              VoiceTask AI
            </h2>
          </div>

          {/* <!-- Hero Section --> */}
          <div className="flex flex-col items-center px-6 pt-10 pb-8 text-center">
            <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight mb-2">
              Create tasks using your voice
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[280px]">
              Organize your productivity through the power of speech.
            </p>
            <div className="mt-12 mb-8 relative">
              {/* <!-- Outer Pulse Effect --> */}
              <div className="absolute inset-0 bg-primary/20 rounded-full scale-125"></div>
              <button
                className="relative flex items-center justify-center size-32 rounded-full bg-primary text-white shadow-xl shadow-primary/30 active:scale-95 transition-transform"
                onClick={handleMicClick}
              >
                <span className="material-symbols-outlined text-5xl">mic</span>
              </button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="px-6 py-3 bg-white dark:bg-slate-800 rounded-full text-primary font-bold shadow-sm border border-slate-100 dark:border-slate-700">
                {info.isRecording ? "Recording..." : "Record task"}
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-sm italic px-4 mt-2">
                "Say something like: Create a task to finish the project
                proposal"
              </p>
            </div>
          </div>

          {/* <!-- Task List Section --> */}
          <div className="px-6 pb-24 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">
                Recent Tasks
              </h3>
            </div>

            <div className="space-y-3">
              {info.loading ? (
                <>
                  <SkeletonLoader />
                  <SkeletonLoader />
                  <SkeletonLoader />
                </>
              ) : tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    className="flex items-start justify-between bg-white dark:bg-slate-900 p-4 rounded shadow-sm border border-slate-100 dark:border-slate-800"
                    key={task?._id}
                  >
                    <div className="flex-1">
                      <h4 className="text-slate-900 dark:text-slate-100 font-bold text-base">
                        {task?.title}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 leading-relaxed">
                        {task?.description}
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-medium mt-1 uppercase tracking-tight">
                        {dayjs?.(task?.createdAt).fromNow()}
                      </p>
                    </div>
                    <button
                      className="text-slate-300 hover:text-red-500 transition-colors ml-4 pt-1"
                      onClick={() => handleDeleteTask(task?._id)}
                    >
                      <span className="material-symbols-outlined text-xl">
                        delete
                      </span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-slate-300 text-5xl">
                    task_alt
                  </span>
                  <p className="text-slate-500 text-sm mt-2">
                    No tasks yet. Try recording one!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
