import Carousel from "../../components/carousel/Carousel";
import SpotlightCard from "../../components/spotlightCard/SpotlighCard";
import AnimationLayout from "../../layouts/animationLayout/AnimationLayout";
import AddTaskRoundedIcon from "@mui/icons-material/AddTaskRounded";
import RemoveDoneRoundedIcon from "@mui/icons-material/RemoveDoneRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { PieChart } from "@mui/x-charts/PieChart";
import "./Analytics.css";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../db/firebase.config.js";
import { collection, getDocs } from "firebase/firestore";

const settings = {
  innerRadius: 50,
  outerRadius: 80,
  paddingAngle: 5,
  cornerRadius: 7,
  borderWidth: 0,
  segmentShowStroke: false,
  highlightScope: { fade: "global", highlight: "item" },
  faded: {
    innerRadius: 45,
    additionalRadius: -5,
    color: "gray",
  },
};

export default function Analytics() {
  const [totalTasks, setTotalTasks] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(null);
  const [uncompletedTasks, setUncompletedTasks] = useState(null);
  const [importantTasks, setImportantTasks] = useState(null);
  const [mediumTasks, setMediumTasks] = useState(null);
  const [unimportantTasks, setUnimportantTasks] = useState(null);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    if (tasks) {
      const completed = tasks.filter((task) => task.completed === true).length;
      const important = tasks.filter((task) => task.priority === "high").length;
      const medium = tasks.filter((task) => task.priority === "medium").length;
      const unimportant = tasks.filter(
        (task) => task.priority === "low"
      ).length;

      setCompletedTasks(completed);
      setUncompletedTasks(tasks.length - completed);
      setTotalTasks(tasks.length);
      setImportantTasks(important);
      setMediumTasks(medium);
      setUnimportantTasks(unimportant);
    }
  }, [tasks]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function fetchTasks() {
    try {
      const tasksRef = collection(db, "users", user.uid, "tasks");
      await getDocs(tasksRef).then((data) => {
        if (data) {
          const tasks = [];
          data.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
          });
          setTasks(tasks);
        }
      });
    } catch (error) {}
  }

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const items = [
    {
      title: "Всього завдань",
      description: "Всі завдання, які ви додали",
      id: 1,
      icon: <AddTaskRoundedIcon sx={{ color: "#060010" }} />,
      dynamicData: totalTasks,
    },
    {
      title: "Виконано завдань",
      description: "Всі завдання, які ви виконали",
      id: 2,
      icon: <DoneRoundedIcon sx={{ color: "#060010" }} />,
      dynamicData: completedTasks,
    },
    {
      title: "Не виконано завдань",
      description: "Всі завдання, які ви ще не виконали",
      id: 3,
      icon: <RemoveDoneRoundedIcon sx={{ color: "#060010" }} />,
      dynamicData: uncompletedTasks,
    },
  ];

  return (
    <AnimationLayout>
      <div className="analytics-page">
        <div className="analytics-page__swiper">
          <SpotlightCard className="analytics-page__carousel-card">
            <Carousel items={items} baseWidth={655} />
          </SpotlightCard>
        </div>
        <div className="analytics-page__cards">
          <SpotlightCard className="analytics-page__card">
            {importantTasks !== null &&
            mediumTasks !== null &&
            unimportantTasks !== null &&
            (importantTasks || mediumTasks || unimportantTasks) ? (
              <PieChart
                sx={{
                  ".MuiPieArc-root": {
                    strokeWidth: 1,
                    stroke: "#f0f0f04e",
                  },
                }}
                colors={["#9d4edd", "#5a189a", "#3c096c"]}
                series={[
                  {
                    ...settings,
                    data: [
                      { value: importantTasks, label: "Важливі" },
                      { value: mediumTasks, label: "Середньої важливості" },
                      { value: unimportantTasks, label: "Неважливі" },
                    ],
                  },
                ]}
                hideLegend
                width={170}
                height={170}
              />
            ) : (
              <p className="analytics-page__message">
                Недостатньо даних для відображення діаграми
              </p>
            )}
          </SpotlightCard>
          <SpotlightCard className="analytics-page__card">
            {completedTasks !== null &&
            uncompletedTasks !== null &&
            (completedTasks || uncompletedTasks) ? (
              <PieChart
                sx={{
                  ".MuiPieArc-root": {
                    strokeWidth: 1,
                    stroke: "#f0f0f04e",
                  },
                }}
                colors={["#9d4edd", "#3c096c"]}
                series={[
                  {
                    ...settings,
                    data: [
                      { value: completedTasks, label: "Виконано" },
                      { value: uncompletedTasks, label: "Не виконано" },
                    ],
                  },
                ]}
                hideLegend
                width={170}
                height={170}
              />
            ) : (
              <p className="analytics-page__message">
                Недостатньо даних для відображення діаграми
              </p>
            )}
          </SpotlightCard>
        </div>
      </div>
    </AnimationLayout>
  );
}
