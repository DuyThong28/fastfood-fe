import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import "dayjs/locale/vi";
dayjs.extend(isBetweenPlugin);

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  isSelected: boolean;
  isHovered: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "isHovered",
})<CustomPickerDayProps>(({ theme, isSelected, isHovered, day }) => ({
  borderRadius: 0,
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.main,
    },
  }),
  ...(isHovered && {
    backgroundColor: theme.palette.primary[theme.palette.mode],
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary[theme.palette.mode],
    },
  }),
  ...(day.day() === 1 && {
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(day.day() === 0 && {
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
}));

const isInSameWeek = (dayA: Dayjs, dayB: Dayjs | null | undefined) => {
  if (dayB == null) {
    return false;
  }

  return dayA.isSame(dayB, "week");
};

function Day(
  props: PickersDayProps<Dayjs> & {
    selectedDay?: Dayjs | null;
    hoveredDay?: Dayjs | null;
  }
) {
  const { day, selectedDay, hoveredDay, ...other } = props;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      sx={{ px: 2.5 }}
      disableMargin
      selected={false}
      isSelected={isInSameWeek(day, selectedDay)}
      isHovered={isInSameWeek(day, hoveredDay)}
    />
  );
}

function SelectTime({
  setNewTime,
  value,
  timeOption,
  handlerSetNewTime,
}: {
  setNewTime: (newTime: Dayjs | null) => void;
  value: Dayjs | null;
  timeOption: string;
  handlerSetNewTime: (newValue: Dayjs | null) => void;
}) {
  const [hoveredDay, setHoveredDay] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <DemoContainer components={["YearCalendar", "MonthCalendar"]}>
        <div className="flex h-[300px] absolute flex-row border border-[#4880ff] overflow-hidden z-[2] bg-white">
          {timeOption === "week" && (
            <DemoItem>
              <div className="h-[300px] w-[300px] rounded-lg bg-white z-[2]">
                <DateCalendar
                  dayOfWeekFormatter={(weekday) => `${weekday.format("dd")}.`}
                  className="w-[300px] h-[300px]"
                  value={value}
                  onChange={(newValue) => handlerSetNewTime(newValue)}
                  showDaysOutsideCurrentMonth
                  slots={{ day: Day }}
                  slotProps={{
                    day: (ownerState) => ({
                      selectedDay: value,
                      hoveredDay,
                      onPointerEnter: () => {
                        setHoveredDay(ownerState.day);
                      },
                      onPointerLeave: () => setHoveredDay(null),
                    }),
                  }}
                />
              </div>
            </DemoItem>
          )}
          {timeOption === "month" && (
            <div className="h-[300px] max-h-[300px] w-[300px] rounded-lg bg-white z-[2]">
              <DemoItem>
                <DateCalendar
                  defaultValue={value}
                  views={["month", "year"]}
                  openTo="month"
                  onMonthChange={(newValue) => handlerSetNewTime(newValue)}
                />
              </DemoItem>
            </div>
          )}
          {timeOption === "year" && (
            <div className="h-[300px] max-h-[300px] w-[300px] rounded-lg bg-white z-[2]">
              <DemoItem>
                <DateCalendar
                  defaultValue={value}
                  views={["year"]}
                  openTo="year"
                  onChange={(newValue) => handlerSetNewTime(newValue)}
                />
              </DemoItem>
            </div>
          )}
        </div>
      </DemoContainer>
    </LocalizationProvider>
  );
}

export default SelectTime;
