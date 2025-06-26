import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import styles from "@/styles/Search.module.css";
import { MdDragIndicator } from "react-icons/md";

const SortableItem = ({ id, index }: { id: string; index: number }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: 8,
    background: "var(--color-white)",
    borderRadius: 4,
    border: "1px solid #cacaca",
    cursor: "grab",
    fontSize: 14,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MdDragIndicator size={16} />{" "}
      <div className={styles.position}>{index + 1}</div> <p>{id}</p>
    </div>
  );
};

const DragAndDropList = () => {
  const [items, setItems] = useState([
    "Property A",
    "Property B",
    "Property C",
  ]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id, index) => (
          <SortableItem key={id} id={id} index={index} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default DragAndDropList;
