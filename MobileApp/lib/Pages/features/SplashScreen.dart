import 'package:animated_splash_screen/animated_splash_screen.dart';
import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:project_name/Pages/auth/AuthContainer.dart';



class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AnimatedSplashScreen(
      backgroundColor: Colors.black,
      splash: Center(
        child: Lottie.network('https://lottie.host/7c5f782c-c764-4044-9dae-3412c6811a5f/yxE2uQwRKp.json'),
      ),
      nextScreen: const AuthContainer(),
      duration: 5000,
      splashIconSize: 10000,
      );
  }
} 