export default function Thumb(props: {
    selected: boolean;
    index: number;
    onClick: () => void;
  }) {
    const { selected, index, onClick } = props;
  
    return (
      <div
        className={"flex-shrink-0 flex-grow-0 border border-#3b74a6-500 aspect-square w-[25%]".concat(
          selected ? " border border-black" : "",
        )}
      >
        <button onClick={onClick} type="button" className="w-full aspect-square">
          {index + 1}
        </button>
      </div>
    );
  }
  