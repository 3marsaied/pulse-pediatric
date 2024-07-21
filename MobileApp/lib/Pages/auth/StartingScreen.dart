import 'package:flutter/material.dart';
import 'package:project_name/Pages/auth/login.dart';
import 'package:project_name/Pages/auth/signupPage.dart';

class StartingScreen extends StatefulWidget {
  const StartingScreen({super.key});

  @override
  State<StartingScreen> createState() => _StartingScreenState();
}

class _StartingScreenState extends State<StartingScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            width: 250, // Adjust the width as needed
            height: 250, // Adjust the height as needed
            decoration: BoxDecoration(
              shape: BoxShape.rectangle,
              image: DecorationImage(
                fit: BoxFit.contain,
                image: AssetImage('assets/icon/0.png'),
              ),
            ),
          ),
          Container(
            padding: EdgeInsets.all(20.0),
            alignment: Alignment.center,
            child: Row( // Wrap buttons in a Row widget
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromARGB(255, 255, 181, 97), // Set the background color to deep orange
                shadowColor: Color.fromARGB(216, 255, 158, 47)
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => LoginPage()),
                    );
                  },
                  child: Text(
                    'Login',
                    style: TextStyle(color: Colors.white),
                  )
                ),
                SizedBox(width: 20), // Add some space between buttons
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromARGB(255, 255, 181, 97), // Set the background color to deep orange
                shadowColor: Color.fromARGB(216, 255, 158, 47)
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => SignupPage()),
                    );
                  },
                  child: Text(
                    'Sign Up',
                    style: TextStyle(color: Colors.white),
                  )
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}