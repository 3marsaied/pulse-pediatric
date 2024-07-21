import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'package:project_name/Pages/Patient/PatientPortal.dart';
import 'package:project_name/Pages/doctor/DoctorPortal.dart';
import 'dart:convert';
import 'package:project_name/routes.dart';

class EditUser extends StatefulWidget {
  final int userId;
  final String? token;
  final String? userName;
  final String? email;
  final String? pic;
  final int? age;
  final String? firstName;
  final String? lastName;
  final String? phone;
  const EditUser ({Key? key, required this.userId, required this.token, this.userName, this.email, this.pic, this.age, this.firstName, this.lastName, this.phone}) : super(key: key);
  
  @override   
  _EditUserState createState() => _EditUserState();
}

class _EditUserState extends State<EditUser> {
  bool contentVisibility = true;
  bool showActiveCommunities = true;
  final double coverHight = 200.0;
  final double profileHight = 104;
  bool isVisible = false;
  bool isActive = false;
  late TextEditingController _usernameController;
  late TextEditingController _passwordController;
  late TextEditingController _emailController;
  late TextEditingController _priceController;
  late TextEditingController _phoneController;
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late var pic = widget.pic;

  @override
  void initState() {
    super.initState();
    _usernameController = TextEditingController(text: widget.userName);
    _passwordController = TextEditingController(); // No need to auto-fill password for security reasons
    _emailController = TextEditingController(text: widget.email);
    _priceController = TextEditingController(text: widget.age.toString());
    _phoneController = TextEditingController(text: widget.phone);
    _firstNameController = TextEditingController(text: widget.firstName);
    _lastNameController = TextEditingController(text: widget.lastName);
  }


  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    _emailController.dispose();
    _priceController.dispose();
    _phoneController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    super.dispose();
  }


  Future <void> updateuser() async{
    final url = Uri.parse(routes.updateUser(widget.userId));
    final headers = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${widget.token!}',
    };

    var  username;
    var  password;
    var  email;
    var  firstName;
    var  lastName;
    var  age;
    var  profilePic;
    var  phoneNumber;
    print('passed data is: ${widget.userId} $username $email $firstName $lastName $phoneNumber $age $profilePic');
    if (_usernameController.text.isEmpty) {
      username = widget.userName;
    }
    else {
      username = _usernameController.text;
    }
    if(_emailController.text.isEmpty) {
      email = widget.email;
    }
    else {
      email = _emailController.text;
    }
    if(_passwordController.text.isEmpty) {
      password = "";
    }
    else {
      password = _passwordController.text;
    }
    if(_priceController.text.isEmpty) {
      age = widget.age;
    }
    else {
          age = int.parse(_priceController.text);
    }
    if(_firstNameController.text.isEmpty) {
      firstName = widget.firstName;
    }
    else {
      firstName = _firstNameController.text;
    }
    if(_lastNameController.text.isEmpty) {
      lastName = widget.lastName;
    }
    else {
      lastName = _lastNameController.text;
    }
    if(pic == null) {
      profilePic = widget.pic;
    }
    else {
      profilePic = pic;
    }
    if(_phoneController.text.isEmpty) {
      phoneNumber = widget.phone;
    }
    else {
      phoneNumber = _phoneController.text;
    }


    final body = jsonEncode({
      'userName': username,
      'email': email,
      'password': password,
      'firstName': firstName,
      'lastName': lastName,
      'phoneNumber':phoneNumber,
      'age': age,
      'profilePicture': profilePic,
    });
    try {
      final response = await http.put(url, headers: headers, body: body);
      print("update doctor response stutus code: ${response.statusCode}");
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
          icon: Icon(Icons.arrow_back,
            color: Colors.white,
          ),
          onPressed: () {
            Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>  PatientPortal(
              token: widget.token,
              userId: widget.userId,
            )));
          },
        ),
        title: Text(
          'Edit Profile',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20.0,
            fontWeight: FontWeight.bold,)
          ),
        actions: <Widget>[
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              foregroundColor: Color.fromARGB(216, 255, 158, 47), backgroundColor: Color.fromARGB(255, 255, 181, 97),
            ),
            child: Text("Save", style: TextStyle(
              color: Colors.white,
            ),),
            onPressed: () async{
              // Save button action
              await updateuser();
              Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>  PatientPortal(
              token: widget.token,
              userId: widget.userId,
            )));

            },
          ),
        ],
      ),
      body: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          buildTop(),
          buildRest(),
        ],
      ),
    );
  }

  Widget buildRest() {
    return Container(
      padding: EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(height: 30.0),
          TextFormField(
            controller: _usernameController,
            decoration: InputDecoration(
              labelText: "UserName",
              hintText: 'Enter your username',
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
            controller: _emailController,
            decoration: InputDecoration(
              labelText: "Email",
              hintText: 'Enter your email',
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
            decoration: InputDecoration(
              labelText: "Password",
              hintText: 'Enter your password',
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
            controller: _priceController,
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
          TextFormField(
            controller: _phoneController,
            decoration: InputDecoration(
              labelText: "Phone Number",
              hintText: 'Enter your Phone Number',
              hintStyle: TextStyle(color: Color(0xFF787878)),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              filled: true, // Fill the background
              fillColor: Color.fromARGB(255, 250, 242, 242),
            ),
          ),
          
        ]
      ),
    );
  }


  Widget buildTop() {
    final top = coverHight - profileHight / 2;
    return Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.center,
      children: [
        Container(
          margin: EdgeInsets.only(bottom: profileHight / 2),
          child: buildCoverImage(),
        ),
        Positioned(
          top: top,
          child: buildProfileImage(),
        ),
        Positioned(
          top: top + profileHight / 2 + 25.0,
          left: MediaQuery.of(context).size.width * 0.5 + 25.0,
          child: GestureDetector(
            onTap: () {
              // Handle changing profile photo
              pickImageFromPhone(ImageSource.gallery);
            },
            child: Container(
              width: 24.0,
              height: 24.0,
              decoration: BoxDecoration(
                color: Colors.purple,
                borderRadius: BorderRadius.circular(22.0),
              ),
              child: Center(
                child: Icon(
                  Icons.add,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget buildCoverImage() => Container(
        color: Colors.grey,
        child: Image.asset(
          'assets/icon/0.png',
          fit: BoxFit.cover,
        ),
        width: double.infinity,
        height: coverHight,
      );

  Widget buildProfileImage() => CircleAvatar(
        radius: profileHight / 2,
        backgroundColor: Colors.black,
        backgroundImage: NetworkImage(pic!),
      );

  void pickImageFromPhone(ImageSource source) async {
    final picker = ImagePicker();
    final pickedImage = await picker.pickImage(source: ImageSource.gallery);

    if (pickedImage != null) {
      var request = http.MultipartRequest('POST', Uri.parse('https://api.imgur.com/3/image'));
      request.files.add(await http.MultipartFile.fromPath('image', pickedImage.path));
      request.headers.addAll({
        'Authorization': 'Client-ID 61abcb0628de673'
      });

      var response = await request.send();
      var responseData = await response.stream.toBytes();
      var responseString = String.fromCharCodes(responseData);

      if (response.statusCode == 200) {
        var data = jsonDecode(responseString);
        pic = data['data']['link'];
        setState(() {
          pic = pic;
        });
        print(pic);
      } else {
        print('Failed to upload image: ${response.statusCode}');
        print('Error: $responseString');
      }
    }
  }
}
