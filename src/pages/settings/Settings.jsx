import SpotlightCard from "../../components/spotlightCard/SpotlighCard";
import AnimationLayout from "../../layouts/animationLayout/AnimationLayout";
import { AlertDialog, Button } from "@radix-ui/themes";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import "./Settings.css";
import { deleteDoc, collection, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";
import { toastStyle } from "../../constants/constants";
import { auth, db } from "../../db/firebase.config";
import { signOut } from "firebase/auth";

export default function Settings({ user }) {
  async function handleDeleteData() {
    try {
      const userDataRef = collection(db, "users", user.uid, "tasks");
      const querySnapshot = await getDocs(userDataRef);
      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises).then(() =>
        toast.success("Дані успішно видалені", {
          style: toastStyle,
        })
      );
    } catch (error) {}
  }

  return (
    <AnimationLayout>
      <div className="settings-page">
        <SpotlightCard>
          <p className="settings-page__paragraph">Ваша пошта</p>
          <p className="settings-page__info">{user.email}</p>
        </SpotlightCard>
        <SpotlightCard>
          <p className="settings-page__paragraph">Дата створення акаунта</p>
          <p className="settings-page__info">
            {new Date(Number(user.metadata.createdAt)).toLocaleString()}:
          </p>
        </SpotlightCard>
        <SpotlightCard>
          <p className="settings-page__paragraph">Платформа</p>
          <p className="settings-page__info">
            {navigator.userAgentData
              ? navigator.userAgentData.platform
              : "unknown"}
          </p>
        </SpotlightCard>
        <SpotlightCard>
          <p className="settings-page__paragraph">Останній вхід до акаунта</p>
          <p className="settings-page__info">
            {new Date(Number(user.metadata.lastLoginAt)).toLocaleString()}
          </p>
        </SpotlightCard>
        <SpotlightCard className="settings-page__bottom-card">
          <Button
            variant="surface"
            size="3"
            className="settings-page__btn"
            onClick={() => signOut(auth)}
          >
            Вийти з акаунта
          </Button>
        </SpotlightCard>
        <SpotlightCard className="settings-page__bottom-card">
          <p className="settings-page__paragraph">Очистити базу даних/записи</p>
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button variant="surface" size="3" className="settings-page__btn">
                <DeleteOutlineRoundedIcon
                  sx={{ fontSize: "18px", color: "#9176FED7" }}
                />
                Очистити
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content className="settings-page__modal-wrapper">
              <AlertDialog.Title>Видалити дані</AlertDialog.Title>
              <AlertDialog.Description size="2">
                Ви впевнені, що хочете видалити всі ваші записи з бази даних?
                <br /> Ця дія є незворотною.
              </AlertDialog.Description>
              <div className="settings-page__modal-wrapper__btns">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Скасувати
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button
                    variant="solid"
                    color="red"
                    onClick={handleDeleteData}
                  >
                    Видалити
                  </Button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </SpotlightCard>
      </div>
    </AnimationLayout>
  );
}
