import React, { useEffect, useState } from 'react';

import { useTheme } from 'styled-components';

import {
  useNavigation,
  NavigationProp,
  ParamListBase,
  useRoute,
} from '@react-navigation/native';

import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Button } from '../../components/Button';

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  Footer,
  RentalPeriod,
  CalendarIconWrapper,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  ArrowIcon,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal,
} from './styles';
import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { getPlataformDate } from '../../utils/getPlataformDate';
import { format } from 'date-fns';
import api from '../../services/api';

interface Params {
  car: CarDTO;
  dates: string[];
}

interface RentalPeriod {
  start: string;
  end: string;
}

export function SchedulingDetails() {
  const [loading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>(
    {} as RentalPeriod,
  );

  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute();
  const { car, dates } = route.params as Params;

  const rentTotal = Number(dates.length * car.rent.price);

  async function handleConfirmRental() {
    try {
      setLoading(true);
      const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`);

      const unavailable_dates = [
        ...schedulesByCar.data.unavailable_dates,
        ...dates,
      ];

      await api.post('schedules_byuser', {
        user_id: 1,
        car,
        startDate: format(getPlataformDate(new Date(dates[0])), 'dd/MM/yyyy'),
        endDate: format(
          getPlataformDate(new Date(dates[dates.length - 1])),
          'dd/MM/yyyy',
        ),
      });

      await api.put(`/schedules_bycars/${car.id}`, {
        id: car.id,
        unavailable_dates,
      });

      navigation.navigate('SchedulingComplete');
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    setRentalPeriod({
      start: format(getPlataformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      end: format(
        getPlataformDate(new Date(dates[dates.length - 1])),
        'dd/MM/yyyy',
      ),
    });
  }, []);

  return (
    <Container>
      <Header>
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      </Header>

      <CarImages>
        <ImageSlider imagesUrl={car.photos} />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.rent.period}</Period>
            <Price>R$ {car.rent.price}</Price>
          </Rent>
        </Details>

        <Accessories>
          {car.accessories.map(accessory => (
            <Accessory
              key={accessory.type}
              name={accessory.name}
              icon={getAccessoryIcon(accessory.type)}
            />
          ))}
        </Accessories>

        <RentalPeriod>
          <CalendarIconWrapper>
            <CalendarIcon name="calendar" />
          </CalendarIconWrapper>

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>

          <ArrowIcon name="chevron-right" />

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuota>
              R$ {car.rent.price} x{dates.length} diárias
            </RentalPriceQuota>
            <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>

      <Footer>
        <Button
          title="Alugar agora"
          color={theme.colors.success}
          onPress={handleConfirmRental}
          loading={loading}
        />
      </Footer>
    </Container>
  );
}
