
import Icon from "@/components/Icon";
import { PROJECT_FILES } from "@/data/windows";

type FolderViewProps = {
  onOpenWindow?: (windowType: string) => void;
};

export default function FolderView({onOpenWindow}: FolderViewProps) {
  return (
    <div className="folder-grid">
      {PROJECT_FILES.map((file) => (
        <Icon
          key={file.windowType}
          name={file.name}
          type="text-icon"
          label={file.label}
          onDoubleClick={() => onOpenWindow?.(file.windowType)}
          x={0}
          y={0}
        />
      ))}
    </div>
  );
}
