import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import "./AnimatedList.css";
import { Badge, Button, CheckboxCards } from "@radix-ui/themes";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const AnimatedItem = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ marginBottom: "1rem", cursor: "pointer" }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedList = ({
  items = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
    "Item 8",
    "Item 9",
    "Item 10",
    "Item 11",
    "Item 12",
    "Item 13",
    "Item 14",
    "Item 15",
  ],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = "",
  itemClassName = "",
  displayScrollbar = true,
  initialSelectedIndex = -1,
  onToggleCompleted,
  deleteItem,
}) => {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const badgeDictionary = {
    low: { color: "green", text: "Низька важливість" },
    medium: { color: "orange", text: "Середня важливість" },
    high: { color: "red", text: "Висока важливість" },
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
      } else if (
        itemBottom >
        containerScrollTop + containerHeight - extraMargin
      ) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: "smooth",
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  function groupTasksByDate(tasks) {
    if (!tasks) return {};

    return tasks.reduce((acc, task) => {
      const date = task.date.toDate();
      const dateString = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      acc[dateString].push(task);
      return acc;
    }, {});
  }

  function sortTasksByTime(tasks) {
    return tasks.sort((a, b) => {
      const aTime = a.hours * 60 + a.minutes;
      const bTime = b.hours * 60 + b.minutes;
      return aTime - bTime;
    });
  }

  function isActualDate(date, hours, minutes) {
    const now = new Date();
    const taskDate = date.toDate();
    const isSameDay =
      taskDate.getFullYear() === now.getFullYear() &&
      taskDate.getMonth() === now.getMonth() &&
      taskDate.getDate() === now.getDate();
    const itemMinutes = hours * 60 + minutes;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return taskDate < now && isSameDay && itemMinutes <= nowMinutes;
  }

  return (
    <div className={`scroll-list-container ${className}`}>
      <div
        ref={listRef}
        className={`scroll-list ${!displayScrollbar ? "no-scrollbar" : ""}`}
        onScroll={handleScroll}
      >
        {Object.entries(groupTasksByDate(items)).map(([date, tasks], index) => (
          <div key={index}>
            <h2 className="scroll-list-container-date">{date}</h2>
            {sortTasksByTime(tasks).map((item, index) => (
              <AnimatedItem
                key={index}
                delay={0.1}
                index={index}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={() => {
                  setSelectedIndex(index);
                  if (onItemSelect) {
                    onItemSelect(item, index);
                  }
                }}
              >
                <div
                  className={`item ${
                    selectedIndex === index ? "selected" : ""
                  } ${itemClassName} ${item.completed ? "completed" : ""} ${
                    isActualDate(item.date, item.hours, item.minutes)
                      ? "actual"
                      : ""
                  }`}
                >
                  <CheckboxCards.Root>
                    <CheckboxCards.Item
                      checked={item.completed}
                      onClick={() =>
                        onToggleCompleted(item.id, !item.completed)
                      }
                      className="scroll-list-checkbox"
                    >
                      <p>Виконано</p>
                    </CheckboxCards.Item>
                  </CheckboxCards.Root>
                  <div className="scroll-list-text">
                    <p className="item-text">
                      <strong>
                        {item.hours.toString().padStart(2, "0")}:
                        {item.minutes.toString().padStart(2, "0")}
                      </strong>
                    </p>
                    <p className="item-text">{item.description}</p>
                  </div>
                  <Badge
                    color={badgeDictionary[item.priority].color}
                    className="scroll-list-badge"
                  >
                    {badgeDictionary[item.priority].text}
                  </Badge>
                  <Button
                    variant="soft"
                    color="red"
                    className="scroll-list-delete-btn"
                    onClick={() => deleteItem(item.id)}
                  >
                    <DeleteOutlineRoundedIcon sx={{ opacity: "0.7" }} />
                  </Button>
                </div>
              </AnimatedItem>
            ))}
          </div>
        ))}
      </div>
      {showGradients && (
        <>
          <div
            className="top-gradient"
            style={{ opacity: topGradientOpacity }}
          ></div>
          <div
            className="bottom-gradient"
            style={{ opacity: bottomGradientOpacity }}
          ></div>
        </>
      )}
    </div>
  );
};

export default AnimatedList;
