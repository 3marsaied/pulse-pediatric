import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:project_name/Pages/Patient/PatientPortal.dart';
import 'dart:convert';
import 'package:project_name/routes.dart';

class AddPatient extends StatefulWidget {
  final int? parentId;
  final String? token;


  const AddPatient({
    Key? key,
    required this.parentId,
    required this.token,
  }) : super(key: key);

  @override
  _AddPatientState createState() => _AddPatientState();
}

class _AddPatientState extends State<AddPatient> {
  bool contentVisibility = true;
  bool showActiveCommunities = true;
  final double coverHight = 200.0;
  final double profileHight = 104;
  bool isVisible = false;
  bool isActive = false;
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _ageController;
  String? _selectedGender;

  @override
  void initState() {
    super.initState();
    _firstNameController = TextEditingController();
    _lastNameController = TextEditingController();
    _ageController = TextEditingController();
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _ageController.dispose();
    super.dispose();
  }

  Future<void> addPatient() async {
    final url = Uri.parse(routes.addPatient);
    final headers = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${widget.token!}',
    };
    var age;
    var gender;
    var firstName;
    var lastName;

    
    age = int.parse(_ageController.text);
    firstName = _firstNameController.text;
    lastName = _lastNameController.text;
    gender = _selectedGender;
    print('add patient data' + age.toString() + ' ' + firstName + ' ' + lastName + ' ' + gender + ' '+ widget.parentId.toString());
    final body = jsonEncode({
      'age': age,
      'gender': gender,
      'firstName': firstName,
      'lastName': lastName,
      'parentId': widget.parentId,
    });
    try {
      final response = await http.post(url, headers: headers, body: body);
      print("update doctor response status code: ${response.statusCode}");
      print("response body : ${response.body}");
      if (response.statusCode == 200) {
        // Successful login, handle response here
        print('Update successful');
      } else {
        print('Failed to update');
      }
    } catch (e) {
      print('Failed to update');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.black,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back,
            color: Colors.white,
          ),
          onPressed: () {
            Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>  PatientPortal(
              token: widget.token,
              userId: widget.parentId,
            )));
          },
        ),
        title: Text(
          'Edit Profile',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20.0,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: <Widget>[
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              foregroundColor: Color.fromARGB(216, 255, 158, 47),
              backgroundColor: Color.fromARGB(255, 255, 181, 97),
            ),
            child: Text(
              "Save",
              style: TextStyle(
                color: Colors.white,
              ),
            ),
            onPressed: () async {
              // Save button action
              await addPatient();
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (BuildContext context) =>
                      PatientPortal(token: widget.token, userId: widget.parentId),
                ),
              );
            },
          ),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              TextFormField(
                controller: _firstNameController,
                decoration: InputDecoration(
                  labelText: "First Name",
                  hintText: 'Enter your First Name',
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
                decoration: InputDecoration(
                  labelText: "Last Name",
                  hintText: 'Enter your Last Name',
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
                controller: _ageController,
                decoration: InputDecoration(
                  labelText: "Age",
                  hintText: 'Enter your Age',
                  hintStyle: TextStyle(color: Color(0xFF787878)),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  filled: true, // Fill the background
                  fillColor: Color.fromARGB(255, 250, 242, 242),
                ),
              ),
              SizedBox(height: 10.0),
              DropdownButtonFormField<String>(
                value: _selectedGender,
                decoration: InputDecoration(
                  labelText: "Gender",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  filled: true,
                  fillColor: Color.fromARGB(255, 250, 242, 242),
                ),
                dropdownColor: Colors.white,
                style: TextStyle(
                  color: Colors.black,
                  fontSize: 16,
                ),
                items: ["Male", "Female"].map((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
                onChanged: (newValue) {
                  setState(() {
                    _selectedGender = newValue;
                  });
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
