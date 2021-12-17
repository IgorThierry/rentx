import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';

import {
  Calendar as CustomCalendar,
  LocaleConfig,
  CalendarProps,
} from 'react-native-calendars';

import { generateInterval } from './generateInterval';

import { ptBR } from './localeConfig';

LocaleConfig.locales['pt-br'] = ptBR;

LocaleConfig.defaultLocale = 'pt-br';

interface MarkedDateProps {
  [date: string]: {
    color: string;
    textColor: string;
    disabled?: boolean;
    disableTouchEvent?: boolean;
  };
}

interface MyCalendarProps extends CalendarProps {
  markedDates: MarkedDateProps;
}

interface DayProps {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

function Calendar({
  markedDates,
  onDayPress,
  markingType = 'period',
  ...rest
}: MyCalendarProps) {
  const { colors, fonts } = useTheme();

  return (
    <CustomCalendar
      {...rest}
      renderArrow={direction => (
        <Feather size={24} color={colors.text} name={`chevron-${direction}`} />
      )}
      headerStyle={{
        backgroundColor: colors.background_secondary,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.text_detail,
        paddingBottom: 10,
        marginBottom: 10,
      }}
      theme={{
        textDayFontFamily: fonts.primary_400,
        textDayHeaderFontFamily: fonts.primary_500,
        textDayHeaderFontSize: 10,
        textMonthFontSize: 20,
        textMonthFontFamily: fonts.secondary_600,
        monthTextColor: colors.title,
        arrowStyle: {
          marginHorizontal: -15,
        },
      }}
      firstDay={1}
      minDate={new Date()}
      markingType={markingType}
      markedDates={markedDates}
      onDayPress={onDayPress}
    />
  );
}

export { Calendar, MarkedDateProps, DayProps, generateInterval };
