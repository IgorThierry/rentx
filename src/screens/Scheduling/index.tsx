import React, { useState } from 'react';

import { Alert, StatusBar, View } from 'react-native';

import { useTheme } from 'styled-components';

import { format } from 'date-fns';

import {
  useNavigation,
  NavigationProp,
  ParamListBase,
  useRoute,
} from '@react-navigation/native';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import {
  Calendar,
  DayProps,
  generateInterval,
  MarkedDateProps,
} from '../../components/Calendar';

import ArrowSvg from '../../assets/arrow.svg';

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValue,
  Content,
  Footer,
} from './styles';
import { getPlataformDate } from '../../utils/getPlataformDate';
import { CarDTO } from '../../dtos/CarDTO';

interface RentalPeriodProps {
  startFormatted: string;

  endFormatted: string;
}

interface Params {
  car: CarDTO;
}

export function Scheduling() {
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>(
    {} as DayProps,
  );

  const [markedDates, setMarkedDates] = useState<MarkedDateProps>(
    {} as MarkedDateProps,
  );

  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriodProps>(
    {} as RentalPeriodProps,
  );

  const { colors } = useTheme();

  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const route = useRoute();
  const { car } = route.params as Params;

  function handleConfirmRental() {
    if (!rentalPeriod.startFormatted || !rentalPeriod.endFormatted) {
      Alert.alert('Selecione o intervalo para alugar.');
    } else {
      navigation.navigate('SchedulingDetails', {
        car,
        dates: Object.keys(markedDates),
      });
    }
  }

  function hanldeChangeDate(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if (start.timestamp > end.timestamp) {
      start = end;
      end = start;
    }

    setLastSelectedDate(end);

    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    const firstDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

    setRentalPeriod({
      startFormatted: format(
        getPlataformDate(new Date(firstDate)),
        'dd/MM/yyyy',
      ),
      endFormatted: format(getPlataformDate(new Date(endDate)), 'dd/MM/yyyy'),
    });
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Header>
        <View style={{ alignSelf: 'flex-start' }}>
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}
            color={colors.shape}
          />
        </View>

        <Title>
          Escolha uma {'\n'}
          data de início e {'\n'}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue selected={!!rentalPeriod.startFormatted}>
              {rentalPeriod.startFormatted}
            </DateValue>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue selected={!!rentalPeriod.endFormatted}>
              {rentalPeriod.endFormatted}
            </DateValue>
          </DateInfo>
        </RentalPeriod>
      </Header>

      <Content>
        <Calendar markedDates={markedDates} onDayPress={hanldeChangeDate} />
      </Content>

      <Footer>
        <Button
          title="Confirmar"
          onPress={() => handleConfirmRental()}
          enabled={!!rentalPeriod.endFormatted}
          
        />
      </Footer>
    </Container>
  );
}
