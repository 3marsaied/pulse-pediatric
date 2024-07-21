import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:project_name/Pages/auth/AuthContainer.dart';
import 'package:project_name/routes.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginPage extends StatefulWidget {
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  late TextEditingController _usernameController;
  late TextEditingController _passwordController;
  late List<dynamic> Data = [];
  late String? token;
  late int userId;

  @override
  void initState() {
    super.initState();
    _usernameController = TextEditingController();
    _passwordController = TextEditingController();
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> login() async {
    String username = _usernameController.text;
    String password = _passwordController.text;
    final url = Uri.parse(routes.login);
    final headers = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    };
    final body = jsonEncode({
      'username': username,
      'password': password,
    });
    try {
      final response = await http.post(url, headers: headers, body: body);

      if (response.statusCode == 200) {
        // Successful login, handle response here
        print('Login successful');
        Data = jsonDecode(response.body) as List<dynamic>;
        token = Data[0]['accessToken'];
        userId = Data[0]['userId'];
        final SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', Data[0]['accessToken']);
        await prefs.setString('role', Data[0]['role']);
        await prefs.setInt('userId', Data[0]['userId']);

        // Clear text fields after successful login
        _usernameController.clear();
        _passwordController.clear();

        print(Data[0]['role']);
        print(Data[0]['userId']);
        print(Data[0]['accessToken']);
        
      } else {
        // Error in login, handle error response here
        print('Login failed');
        print('Status code: ${response.statusCode}');
        print('Response body: ${response.body}');

        // Show a snackbar with an error message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Invalid username or password. Please try again.'),
          ),
        );
      }
    } catch (e) {
      // Exception occurred, handle exception here
      print('Exception occurred during login: $e');
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        leading: GestureDetector(
          onTap: () {
            Navigator.pop(context); // Go back when the leading icon is tapped
          },
          child: Icon(Icons.arrow_back, color: Color.fromARGB(255, 255, 181, 97)),
        ),
        title: Text(
          'Login',
          style: TextStyle(color: Color.fromARGB(255, 255, 181, 97), fontWeight: FontWeight.bold, fontSize: 32.0),
        ),
      ),
      backgroundColor: Colors.white,
      body: Container(
        padding: EdgeInsets.all(20.0),
        alignment: Alignment.center,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            TextFormField(
              controller: _usernameController,
              style: TextStyle(color: Colors.black), // Connect the controller to the TextFormField
              decoration: InputDecoration(
                labelText: 'Username',
                hintStyle: TextStyle(color: Color.fromARGB(255, 124, 123, 123)),
                border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              filled: true, // Fill the background
              fillColor: Color.fromARGB(255, 250, 242, 242),
              )
              ),
            SizedBox(height: 20.0),
            TextFormField(
              controller: _passwordController,
              style: TextStyle(color: Colors.black), // Connect the controller to the TextFormField
              decoration: InputDecoration(
                labelText: 'Password',
                hintStyle: TextStyle(color: Color(0xFF787878)),
                border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              filled: true, // Fill the background
              fillColor: Color.fromARGB(255, 250, 242, 242),
              ),
              obscureText: true,
            ),
            SizedBox(height: 20.0),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color.fromARGB(255, 255, 181, 97), // Set the background color to deep orange
                shadowColor: Color.fromARGB(216, 255, 158, 47)
              ),
              onPressed: () async {
                await login();
                    Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => AuthContainer( role: Data[0]['role'],)));
                },
              child: Text(
                'Login',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
