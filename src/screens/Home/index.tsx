import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, BackHandler } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from 'styled-components';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';

import { RectButton, PanGestureHandler } from 'react-native-gesture-handler';

import {
  useNavigation,
  NavigationProp,
  ParamListBase,
  useFocusEffect,
} from '@react-navigation/native';

import Logo from '../../assets/logo.svg';
import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';

import api from '../../services/api';

import { CarDTO } from '../../dtos/CarDTO';

import { Container, Header, HeaderContent, TotalCars, CarList } from './styles';

const ButtonAnimated = Animated.createAnimatedComponent(RectButton);

export function Home() {
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const theme = useTheme();

  const positionY = useSharedValue(0);
  const positionX = useSharedValue(0);

  const myCarsButtonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value },
    ],
  }));

  const onGestureEvent = useAnimatedGestureHandler({
    onStart(_, ctx: any) {
      ctx.positionX = positionX.value;
      ctx.positionY = positionY.value;
    },
    onActive(event, ctx: any) {
      positionX.value = ctx.positionX + event.translationX;
      positionY.value = ctx.positionY + event.translationY;
    },
    onEnd() {
      positionX.value = withSpring(0);
      positionY.value = withSpring(0);
    },
  });

  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car });
  }
  function handleOpenMyCars() {
    navigation.navigate('MyCars');
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const response = await api.get('/cars');
        setCars(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  });

  return (
    <>
      <Container>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <Header>
          <HeaderContent>
            <Logo width={RFValue(108)} height={RFValue(12)} />
            {!loading && <TotalCars>Total de {cars.length} carros</TotalCars>}
          </HeaderContent>
        </Header>

        {loading ? (
          <LoadAnimation />
        ) : (
          <CarList
            data={cars}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Car data={item} onPress={() => handleCarDetails(item)} />
            )}
          />
        )}

        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View
            style={[
              myCarsButtonStyle,
              { position: 'absolute', bottom: 13, right: 22 },
            ]}
          >
            <ButtonAnimated
              onPress={handleOpenMyCars}
              style={[styles.button, { backgroundColor: theme.colors.main }]}
            >
              <Ionicons
                name="ios-car-sport"
                size={32}
                color={theme.colors.shape}
              />
            </ButtonAnimated>
          </Animated.View>
        </PanGestureHandler>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
