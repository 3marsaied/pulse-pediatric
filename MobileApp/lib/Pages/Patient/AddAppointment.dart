import 'package:flutter/material.dart';
import 'package:project_name/Pages/Patient/PatientPortal.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:project_name/routes.dart';
import 'package:project_name/utils.dart';
import 'package:url_launcher/url_launcher.dart';

class AddAppointment extends StatefulWidget {
  final String? token;
  final int? parentId;
  const AddAppointment({Key? key, required this.token, required this.parentId}) : super(key: key);

  @override
  State<AddAppointment> createState() => _AddAppointmentState();
}

class _AddAppointmentState extends State<AddAppointment> {
  late List<dynamic> patientList = [];
  late List<dynamic> doctorList = [];
  late List<dynamic> appointmentList = [];
  int? selectedPatientId;
  int? selectedDoctorId;
  String? selectedPatientName;
  String? selectedDoctorName;
  String? appointmentDate;
  int? from;
  late String FromAm = 'AM';
  late String ToAm = 'AM';
  late bool isSelected = false;

  final List<String> weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  final List<String> timeSlots = ['9', '10', '11', '12', '13', '14', '15', '16', '17'];

  @override
  void initState() {
    super.initState();
    getPatient();
    _doctorList();
    getAllAppointments();
  }

  Future<void> getPatient() async {
    final url = Uri.parse(routes.yourPatients(widget.parentId!));
    final headers = {
      'accept': 'application/json',
      'Authorization': 'Bearer ${widget.token!}',
    };

    final response = await http.get(url, headers: headers);
    print("get Patient response status: " + response.statusCode.toString());
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        patientList = data;
      });
    } else {
      print("get Patient response status: " + response.statusCode.toString());
    }
  }

  Future<void> getAllAppointments() async {
    final url = Uri.parse(routes.getAllAppointments);
    final response = await http.get(url);

    print("get All Appointments response status: " + response.statusCode.toString());
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        appointmentList = data;
      });
    } else {
      print("get All Appointments response status: " + response.statusCode.toString());
    }
  }

  Future<void> _doctorList() async {
    final url = Uri.parse(routes.doctorList);
    final response = await http.get(url);

    print("get Doctor response status: " + response.statusCode.toString());
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      doctorList = data;
      setState(() {});
    } else {
      print("get Doctor response status: " + response.statusCode.toString());
    }
  }

  Future<void> addAppointment() async {
    final url = Uri.parse(routes.addAppointments);
    final headers = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${widget.token!}',
    };

    print("add Appointment response status: parent ID: ${widget.parentId} doctor ID: $selectedDoctorId patient ID: $selectedPatientId appointment Date: $appointmentDate From: $from To: ${from! + 1} isTaken: true");
    var date = convertDateFormatToSend(appointmentDate!);
     final body = jsonEncode({
      'parentId': widget.parentId!,
      'doctorId': selectedDoctorId!,
      "patientId": selectedPatientId!,
      "appointmentDate": date,
      "From": "$from",
      "To": "${from! + 1}",
      "isTaken": true
    });
    

    var response = await http.post(url, headers: headers, body: body);
    print("add Appointment response status: ${response.statusCode}");
  }

  Future<void> _confirmAddAppointment() async {
     // Helper function to show a dialog
    Future<bool?> _showConfirmationDialog(String title, String content, bool isTrue) {
      return showDialog<bool>(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: Text(title),
            content: Text(content),
            actions: [
              isTrue
                  ? Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pop(false);
                    },
                    child: Text(
                      'Cancel',
                      style: TextStyle(fontSize: 18),
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pop(true);
                    },
                    child: Text(
                      'Confirm',
                      style: TextStyle(fontSize: 18),
                    ),
                  ),
                ],
              )
                  : TextButton(
                onPressed: () {
                  Navigator.of(context).pop(false);
                },
                child: Text(
                  'Cancel',
                  style: TextStyle(fontSize: 18),
                ),
              )
            ],
          );
        },
      );
    }

    // Check if the selected patient is missing
    if (selectedPatientId == null || selectedPatientId == 0) {
      bool? patientSelected = await _showConfirmationDialog(
        'Select Patient',
        'Please select a patient first.',
        false,
      );
      if (patientSelected == false) return;
    }

    // Check if the selected doctor is missing
    if (selectedDoctorId == null || selectedDoctorId == 0) {
      bool? doctorSelected = await _showConfirmationDialog(
        'Select Doctor',
        'Please select a doctor first.',
        false,
      );
      if (doctorSelected == false) return;
    }

    // Check if the appointment date and time are missing
    if (appointmentDate == null || from == null) {
      bool? appointmentSelected = await _showConfirmationDialog(
        'Select Appointment',
        'Please select a day and time for the appointment.',
        false,
      );
      if (appointmentSelected == false) return;
    }

    // If all fields are provided, confirm addition of the appointment
    bool? confirmed = await _showConfirmationDialog(
      'Confirm Addition',
      'Are you sure you want to add this appointment?',
      true,
    );

    if (confirmed == true) {
      await addAppointment();
      // Navigate back to PatientPortal
      setState(() {
        Navigator.pop(context);
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => PatientPortal(
              token: widget.token,
              userId: widget.parentId,
            ),
          ),
        );
      });
    }
  }

  void _openGoogleCalendar() async {
    DateTime now = DateTime.now();
    String url = 'https://www.google.com/calendar/render#main_7%7Cday';

    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not open Google Calendar';
    }
  }

  void _showSelectionBottomSheet(
      BuildContext context, List<dynamic> items, Function(int, String) onSelected, String title) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Container(
          height: 400,
          color: Colors.grey[200], // Change the background color here
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ),
              Expanded(
                child: ListView.builder(
                  itemCount: items.length,
                  itemBuilder: (BuildContext context, int index) {
                    final item = items[index];
                    final fullName = title == "Choose Patient"
                        ? '${item['firstName']} ${item['lastName']}'
                        : '${item['title']}';
                    return ListTile(
                      leading: title == "Choose Doctor"
                          ? CircleAvatar(
                        radius: 16,
                        backgroundImage: NetworkImage(item['thumbnail']),
                        backgroundColor: Colors.transparent,
                      )
                          : null,
                      title: Text(fullName, style: TextStyle(color: Colors.black)), // Change text color here
                      tileColor: Colors.white, // Change tile background color here
                      selectedTileColor: Colors.blue[100], // Change selected tile color here
                      onTap: () {
                        onSelected(item['id'], fullName);
                        Navigator.pop(context);
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  bool isSlotTaken(String day, String time) {
    if (selectedDoctorId == null) return false;
    for (var appointment in appointmentList) {
      var date = (appointment['appointmentDate']);
      if (appointment['doctorId'] == selectedDoctorId &&
           date == day &&
          appointment['From'] == time && // Removed curly braces and ensure same type comparison
          appointment['isTaken'] == true) {
        return true;
      }
      if(appointment['patientId'] == selectedPatientId &&
          date == day &&
          appointment['From'] == time && // Removed curly braces and ensure same type comparison
          appointment['isTaken'] == true) {
        return true;
      }
    }
    return false;
  }

  Future<void> _pickDate() async {
    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(Duration(days: 365)),
    );

    if (pickedDate != null) {
      setState(() {
        appointmentDate = "${pickedDate.toLocal()}".split(' ')[0];
      });
    }
  }

  Future<void> _pickFromTime() async {
    final List<TimeOfDay> disabledTimes = _getDisabledTimes();

    // Show bottom sheet with list of time slots
    await showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Container(
          height: 400,
          color: Colors.grey[200],
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text('Select Time', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ),
              Expanded(
                child: ListView.builder(
                  itemCount: timeSlots.length,
                  itemBuilder: (BuildContext context, int index) {
                    final hour = int.parse(timeSlots[index]);
                    final time = TimeOfDay(hour: hour, minute: 0);
                    final isEnabled = !disabledTimes.contains(time);
                    return ListTile(
                      title: Text(
                        '${hour.toString().padLeft(2, '0')}:00',
                        style: TextStyle(color: isEnabled ? Colors.black : Colors.grey),
                      ),
                      onTap: isEnabled ? () {
                        setState(() {
                          from = hour;
                          Navigator.pop(context); // Close bottom sheet on selection
                        });
                      } : null,
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }


  List<TimeOfDay> _getDisabledTimes() {
    final List<TimeOfDay> disabledTimes = [];

    // Add times outside the range of 9am to 5pm with minutes as 00
    for (int hour = 0; hour < 24; hour++) {
      if (hour < 9 || hour >= 17 || isSlotTaken(appointmentDate!, hour.toString())) {
        disabledTimes.add(TimeOfDay(hour: hour, minute: 0));
      }
    }

    return disabledTimes;
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
                builder: (context) => PatientPortal(
                  token: widget.token,
                  userId: widget.parentId,
                ),
              ),
            );
          },
        ),
        title: const Text(
          'Add Appointment',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20.0,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
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
              await _confirmAddAppointment();
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          shrinkWrap: true,
          children: [
            Column(
              children: [
                SizedBox(height: 10),
                Center(
                  child: Text(
                    'Choose Patient:',
                    style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 22,
                    ),
                  ),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromARGB(216, 255, 158, 47), // Background color
                    foregroundColor: Colors.white, // Text color
                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: () => _showSelectionBottomSheet(
                    context,
                    patientList,
                    (id, name) => setState(() {
                      selectedPatientId = id;
                      selectedPatientName = name;
                    }),
                    'Choose Patient',
                  ),
                  child: Text(
                    selectedPatientName != null ? selectedPatientName! : 'Select Patient',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ],
            ),
            Divider(
              color: Color.fromARGB(255, 211, 210, 210),
              thickness: 2,
            ),
            Column(
              children: [
                SizedBox(height: 10),
                Center(
                  child: Text(
                    'Choose Doctor:',
                    style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 22,
                    ),
                  ),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromARGB(216, 255, 158, 47), // Background color
                    foregroundColor: Colors.white, // Text color
                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: () => _showSelectionBottomSheet(
                    context,
                    doctorList,
                    (id, name) => setState(() {
                      selectedDoctorId = id;
                      selectedDoctorName = name;
                    }),
                    'Choose Doctor',
                  ),
                  child: Text(
                    selectedDoctorName != null ? selectedDoctorName! : 'Select Doctor',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ],
            ),
            Divider(
              color: Color.fromARGB(255, 211, 210, 210),
              thickness: 2,
            ),
            Column(
              children: [
                SizedBox(height: 20),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromARGB(216, 255, 158, 47), // Background color
                    foregroundColor: Colors.white, // Text color
                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: _pickDate,
                  child: Text(
                    'Choose Appointment Date',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ],
            ),
            Divider(
              color: Color.fromARGB(255, 211, 210, 210),
              thickness: 2,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color.fromARGB(216, 255, 158, 47),
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: _pickFromTime, // This line should call _pickFromTime when the button is pressed
              child: Text(
                'Choose From Time',
                style: TextStyle(fontSize: 16),
              ),
            ),

            Divider(
              color: Color.fromARGB(255, 211, 210, 210),
              thickness: 2,
            ),
            SizedBox(height: 10),
            Center(
                child: Text(
                    'Choose Appointment Slot:',
                    style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 22,
                    ),
                ),
            ),
            SizedBox(height: 10),
            Center(
                child: Text('You want to add Appointment at ${appointmentDate ?? "(not selected yet)"} from ${from != null ? "$from:00" : "(not selected yet)"} to ${from != null ? "${from! + 1}:00" : "(not selected yet)"}')
            ),
          ],
        ),
      ),
    );
  }
}
