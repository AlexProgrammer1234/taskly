import { Dialog, TextField, DropdownMenu, Button } from "@radix-ui/themes";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { uk } from "date-fns/locale/uk";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import "./AddTaskModalContent.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { toastStyle } from "../../constants/constants";
import { db, auth } from "../../db/firebase.config.js";
import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function AddTaskModalContent() {
  const [user, setUser] = useState(null);

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

  const [modalData, setModalData] = useState({
    description: "",
    date: null,
    hours: null,
    minutes: null,
    priority: null,
  });

  const priorityDictionary = {
    low: "Низька",
    medium: "Середня",
    high: "Висока",
  };

  async function saveData() {
    if (user) {
      if (
        !modalData.description ||
        !modalData.date ||
        modalData.hours === null ||
        modalData.minutes === null ||
        !modalData.priority
      ) {
        toast.error("Будь ласка, заповніть всі поля завдання.", {
          style: toastStyle,
        });
        return;
      }

      const taskRef = collection(db, "users", user.uid, "tasks");

      try {
        await addDoc(taskRef, {
          ...modalData,
          timestamp: serverTimestamp(),
        }).then(() => {
          setModalData({
            description: "",
            date: null,
            hours: null,
            minutes: null,
            priority: null,
          });

          toast.success("Завдання успішно додано!", { style: toastStyle });
        });
      } catch (error) {
        toast.error("Помилка при додаванні завдання. Спробуйте ще раз.", {
          style: toastStyle,
        });
      }
    }
  }

  return (
    <Dialog.Content className="home-page__dialog">
      <Dialog.Title>Додати завдання</Dialog.Title>
      <div className="home-page__modal-content">
        <TextField.Root
          value={modalData.description}
          onChange={(e) =>
            setModalData({ ...modalData, description: e.target.value })
          }
          placeholder="Опис завдання"
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
          <DateCalendar
            value={modalData.date}
            onChange={(newDate) =>
              setModalData({
                ...modalData,
                date: newDate,
              })
            }
            sx={{
              "*": {
                color: "white !important",
                ".Mui-selected": {
                  backgroundColor: "#8670dbff !important",
                },
              },
            }}
          />
        </LocalizationProvider>
        <div className="home-page__modal-content__btns">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button className="home-page__dropdown-btn" variant="soft">
                {modalData.hours !== null && modalData.hours !== undefined
                  ? modalData.hours.toString().padStart(2, "0")
                  : "ГГ"}
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: "20px" }} />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {Array.from({ length: 24 }, (_, i) => (
                <DropdownMenu.Item
                  key={i}
                  onClick={() => setModalData({ ...modalData, hours: i })}
                >
                  {i.toString().padStart(2, "0")}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button className="home-page__dropdown-btn" variant="soft">
                {modalData.minutes !== null && modalData.minutes !== undefined
                  ? modalData.minutes.toString().padStart(2, "0")
                  : "ХХ"}
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: "20px" }} />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {Array.from({ length: 60 }, (_, i) => (
                <DropdownMenu.Item
                  key={i}
                  onClick={() => setModalData({ ...modalData, minutes: i })}
                >
                  {i.toString().padStart(2, "0")}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button className="home-page__dropdown-btn" variant="soft">
                {modalData.priority
                  ? priorityDictionary[modalData.priority]
                  : "Важливість"}
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: "20px" }} />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                onClick={() => setModalData({ ...modalData, priority: "low" })}
              >
                Низька
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() =>
                  setModalData({ ...modalData, priority: "medium" })
                }
              >
                Середня
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => setModalData({ ...modalData, priority: "high" })}
              >
                Висока
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>

      <div className="home-page__dialog-btns">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            Скасувати
          </Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button variant="soft" color="green" onClick={saveData}>
            Зберегти
          </Button>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  );
}
