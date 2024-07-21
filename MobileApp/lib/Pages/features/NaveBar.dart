import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';

class NavBar extends StatelessWidget {
  const NavBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: GNav(
          hoverColor: const Color.fromARGB(255, 121, 117, 117), // tab button hover color
          haptic: true, // haptic feedback
          curve: Curves.easeOutExpo, // tab animation curves
          duration: Duration(milliseconds: 300), // tab animation duration
          gap: 6, // the tab button gap between icon and text 
          color: Color.fromARGB(255, 0, 0, 0), // unselected icon color
          activeColor: Color.fromARGB(255, 0, 0, 0),// selected icon and text color
          iconSize: 28, // tab button icon size
          tabBackgroundColor: Color.fromARGB(255, 255, 181, 97), // selected tab background color
          padding: EdgeInsets.symmetric(horizontal: 10, vertical: 10),
          onTabChange: (index){
            // Handle tab change
          },
          tabs: [
            GButton(
              icon: Icons.circle, // You need to provide a placeholder icon
              text: 'Appointments',
              leading: Row(
                children: [
                  Image.asset(
                    'assets/icon/table.png',
                    width: 28,
                    height: 28,
                     // optional: color the icon
                  ),
                ]
              ),
            ),
            GButton(
              icon: Icons.circle, // You need to provide a placeholder icon
              text: 'Search',
              leading: Row(
                children: [
                  Image.asset(
                    'assets/icon/table.png',
                    width: 28,
                    height: 28,
                  ),
                  SizedBox(width: 6), // Adjust the width as per your requirement
                ],
              ),
            ),
            GButton(
              icon: Icons.circle, // You need to provide a placeholder icon
              text: 'Bookmark',
              leading: Row(
                children: [
                  Image.asset(
                    'assets/icon/table.png',
                    width: 28,
                    height: 28,
                  ),
                  SizedBox(width: 6), // Adjust the width as per your requirement
                ],
              ),
            ),
            GButton(
              icon: Icons.circle, // You need to provide a placeholder icon
              text: 'Settings',
              leading: Row(
                children: [
                  Image.asset(
                    'assets/icon/table.png',
                    width: 28,
                    height: 28, // optional: color the icon
                  ),
                  SizedBox(width: 6), // Adjust the width as per your requirement
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
