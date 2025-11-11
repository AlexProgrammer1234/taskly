import { Button, Dialog, DropdownMenu } from "@radix-ui/themes";
import AnimationLayout from "../../layouts/animationLayout/AnimationLayout";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import "./Home.css";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import AddTaskModalContent from "../../components/addTaskModalContent/AddTaskModalContent";
import AnimatedList from "../../components/animatedList/AnimatedList";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../db/firebase.config.js";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import Loader from "../../components/loader/Loader";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const dropdownDictionary = {
  today: "Сьогоднішні",
  all: "Всі завдання",
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addMouseOver, setAddMouseOver] = useState(false);
  const [tasks, setTasks] = useState(null);
  const [tasksFilter, setTasksFilter] = useState("today");

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
        setLoading(false);
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

  useEffect(() => {
    if (user) {
      const tasksRef = collection(db, "users", user.uid, "tasks");
      const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
        const tasks = [];
        snapshot.forEach((doc) => {
          tasks.push({ id: doc.id, ...doc.data() });
        });
        setTasks(tasks);
      });

      return () => unsubscribe();
    }
  }, [user]);

  function filterTasks(tasks) {
    if (!tasks) return [];

    if (tasksFilter === "today") {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return tasks
        .filter(
          (task) =>
            task.date &&
            task.date.toDate() >= now &&
            task.date.toDate() < tomorrow
        )
        .sort((a, b) => {
          const aTime = a.hours * 60 + a.minutes;
          const bTime = b.hours * 60 + b.minutes;
          return aTime - bTime;
        });
    } else {
      return tasks.sort((a, b) => {
        return a.date.toDate() - b.date.toDate();
      });
    }
  }

  async function toggleTaskCompleted(taskId, completed) {
    try {
      const taskRef = doc(db, "users", user.uid, "tasks", taskId);
      await updateDoc(taskRef, { completed: completed });
    } catch (error) {}
  }

  async function deleteItem(taskId) {
    try {
      const taskRef = doc(db, "users", user.uid, "tasks", taskId);
      await deleteDoc(taskRef);
    } catch (error) {}
  }

  return (
    <AnimationLayout>
      <div className="home-page">
        <div className="home-page__header">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild className="home-page__dropdown">
              <Button variant="soft">
                {dropdownDictionary[tasksFilter]}
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: "20px" }} />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item onClick={() => setTasksFilter("today")}>
                Сьогоднішні завдання
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setTasksFilter("all")}>
                Всі завдання
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <div className="home-page__add-btn">
            {!addMouseOver && (
              <motion.div
                onMouseEnter={() => setAddMouseOver(true)}
                onMouseLeave={() => setAddMouseOver(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <AddCircleOutlineRoundedIcon
                  sx={{
                    fontSize: "30px",
                    color: "#8670dbff",
                    cursor: "pointer",
                    background: "#8570db23",
                    borderRadius: "50%",
                    padding: "2px",
                  }}
                />
              </motion.div>
            )}
            <Dialog.Root className="home-page__dialog">
              {addMouseOver && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <Dialog.Trigger
                    asChild
                    className="home-page__add-btn__trigger"
                  >
                    <Button
                      onMouseEnter={() => setAddMouseOver(true)}
                      onMouseLeave={() => setAddMouseOver(false)}
                      variant="ghost"
                    >
                      Додати завдання
                    </Button>
                  </Dialog.Trigger>
                </motion.div>
              )}
              <AddTaskModalContent />
            </Dialog.Root>
          </div>
        </div>
        {!loading ? (
          <AnimatedList
            items={filterTasks(tasks) || []}
            showGradients={false}
            enableArrowNavigation={true}
            displayScrollbar={true}
            onToggleCompleted={toggleTaskCompleted}
            deleteItem={deleteItem}
          />
        ) : (
          <Loader />
        )}
      </div>
    </AnimationLayout>
  );
}
