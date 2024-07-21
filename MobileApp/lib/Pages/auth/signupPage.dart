import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:project_name/Pages/Patient/PatientPortal.dart';
import 'package:project_name/routes.dart';
import 'package:shared_preferences/shared_preferences.dart';



class SignupPage extends StatefulWidget {
  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  late TextEditingController _emailController;
  late TextEditingController _passwordController;
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _userNameController;
  late TextEditingController _phoneController;
  late Map<String,dynamic> Data = {};
  late String? token;
  late int userId;

  @override
  void initState() {
    super.initState();
    _firstNameController = TextEditingController();
    _lastNameController = TextEditingController();
    _userNameController = TextEditingController();
    _phoneController = TextEditingController();
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
  }


Future<void> signUp() async {
  String username = _userNameController.text;
  String password = _passwordController.text;
  String firstName = _firstNameController.text;
  String lastName = _lastNameController.text;
  String phone = _phoneController.text;
  String email = _emailController.text;

  // Use the correct URL for signup
  final url = Uri.parse('https://pediatric-pulse.onrender.com/signup');

  final headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  };

  // Correct field names in the body
  final body = jsonEncode({
    'userName': username,
    'password': password,
    'email': email,
    'firstName': firstName,
    'lastName': lastName,
    'phone': phone,
  });

  try {
    final response = await http.post(url, headers: headers, body: body);

    if (response.statusCode == 201) {
      // Successful signup, handle response here
      print('Sign Up successful');
      Data = jsonDecode(response.body);
      token = Data['accessToken'];
      userId = Data['userId'];
      
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', Data['accessToken']);
      await prefs.setString('role', Data['role']);
      await prefs.setInt('userId', Data['userId']);
    } else {
      // Error in signup, handle error response here
      print('Sign Up failed');
      print('Status code: ${response.statusCode}');
      print('Response body: ${response.body}');
    }
  } catch (e) {
    // Exception occurred, handle exception here
    print('Exception occurred during Sign Up: $e');
  }
}


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        leading: GestureDetector(
          onTap: () {
            Navigator.pop(context); 
          },
          child: Icon(Icons.arrow_back, color: Color.fromARGB(255, 255, 181, 97)),
        ),
        title: Text(
          'Sign Up',
          style: TextStyle(color: Color.fromARGB(255, 255, 181, 97), fontWeight: FontWeight.bold, fontSize: 32.0)
          ),
      ),
      backgroundColor: Colors.white,
      body: Container(
        padding: EdgeInsets.all(20.0),
        alignment: Alignment.center,
        child: ListView(
          children: <Widget>[
            SizedBox(height: 100.0),
            TextFormField(
              controller: _emailController,
              style: TextStyle(color: Colors.black),
              decoration: InputDecoration(
                labelText: 'Email',
                hintStyle: TextStyle(color: Color(0xFF787878)),
                border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              filled: true, // Fill the background
              fillColor: Color.fromARGB(255, 250, 242, 242),
              ),
            ),
            SizedBox(height: 10.0),
            TextFormField(
              controller: _userNameController,
              style: TextStyle(color: Colors.black),
              decoration: InputDecoration(
                labelText: 'User Name',
                hintStyle: TextStyle(color: Color(0xFF787878)),
                border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              filled: true, // Fill the background
              fillColor: Color.fromARGB(255, 250, 242, 242),
              ),
            ),
            SizedBox(height: 10.0),
            TextFormField(
              controller: _passwordController,
              style: TextStyle(color: Colors.black),
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
            SizedBox(height: 10.0),
            TextFormField(
              controller: _firstNameController,
              style: TextStyle(color: Colors.black),
              decoration: InputDecoration(
                labelText: 'First Name',
                hintStyle: TextStyle(color: Color(0xFF787878)),
                border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              filled: true, // Fill the background
              fillColor: Color.fromARGB(255, 250, 242, 242),
              ),
            ),
            SizedBox(height: 10.0),
            TextFormField(
              controller: _lastNameController,
              style: TextStyle(color: Colors.black),
              decoration: InputDecoration(
                labelText: 'Last Name',
                hintStyle: TextStyle(color: Color(0xFF787878)),
                border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              filled: true, // Fill the background
              fillColor: Color.fromARGB(255, 250, 242, 242),
              ),
            ),
            SizedBox(height: 10.0),
            TextFormField(
              controller: _phoneController,
              style: TextStyle(color: Colors.black),
              decoration: InputDecoration(
                labelText: 'Phone Number',
                hintStyle: TextStyle(color: Color(0xFF787878)),
                border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              filled: true, // Fill the background
              fillColor: Color.fromARGB(255, 250, 242, 242),
              ),
            ),
            SizedBox(height: 20.0),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color.fromARGB(255, 255, 181, 97), // Set the background color to deep orange
                shadowColor: Color.fromARGB(216, 255, 158, 47),
              ),
              onPressed: () async {
                await signUp();
                Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => PatientPortal(
                  token: token,
                  userId: userId,
                  )
                ));
                
              },
              child: Text(
                'Sign Up',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
      )
    );
  }
}
