import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    isBefore,
    startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Calendar = ({ selectedDate, onSelectDate, className }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = startOfDay(new Date());

    const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4 px-2">
                <button
                    onClick={onPrevMonth}
                    disabled={isBefore(currentMonth, startOfMonth(new Date()))}
                    className="p-2 rounded-full hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="text-white font-bold text-lg">
                    {format(currentMonth, 'MMMM yyyy')}
                </div>
                <button
                    onClick={onNextMonth}
                    className="p-2 rounded-full hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const dateFormat = "EEEE";
        const startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider py-2" key={i}>
                    {format(addDays(startDate, i), 'EEEEE')}
                </div>
            );
        }

        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;
                const isPast = isBefore(day, today);
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                const isToday = isSameDay(day, today);
                const isCurrentMonth = isSameMonth(day, monthStart);

                days.push(
                    <div
                        className="relative w-full aspect-square p-0.5"
                        key={day}
                    >
                        <button
                            disabled={isPast}
                            onClick={() => onSelectDate(cloneDay)}
                            className={cn(
                                "w-full h-full flex items-center justify-center rounded-full text-xs font-medium transition-all duration-200",
                                !isCurrentMonth && "text-zinc-800",
                                isCurrentMonth && !isPast && "text-gray-400 hover:bg-zinc-800 hover:text-white",
                                isPast && "text-zinc-800 cursor-not-allowed",
                                isToday && !isSelected && "bg-zinc-800 text-primary font-bold",
                                isSelected && "bg-primary text-black font-bold shadow-sm"
                            )}
                        >
                            {formattedDate}
                        </button>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="space-y-0">{rows}</div>;
    };

    return (
        <div className={cn("bg-transparent p-2", className)}>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </div>
    );
};

export default Calendar;
