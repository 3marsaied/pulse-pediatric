import 'package:shared_preferences/shared_preferences.dart';

Future<void> saveStringData(String Name, String Data) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  await prefs.setString(Name, Data);
}


Future<void> saveIntData(String Name, int Data) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  await prefs.setInt(Name, Data);
}


String convertDateFormat(String date) {
  // Split the date string into its components
  List<String> parts = date.split('-');
  
  if (parts.length != 3) {
    throw FormatException('Invalid date format, expected mm-dd-yyyy');
  }

  // Rearrange parts to the desired format
  String formattedDate = '${parts[0]}-${parts[2]}-${parts[1]}';

  return formattedDate;
}

String convertDateFormatToSend(String date) {
  // Split the date string into its components
  List<String> parts = date.split('-');
  
  if (parts.length != 3) {
    throw FormatException('Invalid date format, expected mm-dd-yyyy');
  }

  // Rearrange parts to the desired format
  String formattedDate = '${parts[1]}/${parts[2]}/${parts[0]}';

  return formattedDate;
}
