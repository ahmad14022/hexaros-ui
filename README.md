<div align="center">
  <a href="https://gitlab.com/mbkm/code-repositories/batch-3/manufacture_agv/hexaros-ui/-/tree/master" target="_blank"><img src="/public/assets/images/doc/Logo.jpg" width="100">
  </a>``
  <br>
  <br>
  <p>Hexaros</p>


</div>

## Tentang Project
HexaRos adalah Website yang digunakan untuk mengontrol dan memonitor robot AGV. Basis kode aplikasi ini menggunakan basis kode _frontend_ dengan library [Vue JS v3](https://vuejs.org/).

## Fitur

Beberapa fitur yang ada di dalam aplikasi ini adalah:

| Fitur                  | Keterangan                                                                                                                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status koneksi         | Terletak di pojok kanan atas, fitur ini akan menginformasikan status koneksi dengan robot.                                                                                                                            |
| IP & Port              | Memungkinkan pengguna untuk menginputkan IP dan Port yang digunakan oleh robot AGV                                                                                                                                    |
| Map                    | Fitur ini menampilkan map dan lokasi robot                                                                                                                                                                            |
| Mode `Navigation Goal` | Mode ini memungkinakan pengguna untuk mengontrol robot dengan menentukan goal atau destinasinya di map dengan cara melakukan klik di bagian map. Untuk mengirimkan goal, tekan tombol `Run`                     |
| Mode `Joystick`        | Mode ini memungkinkan pengguna untuk mengontrol pergerakan robot secara manual                                                                                                                                        |
| Tombol `Cancel`   | Fitur ini akan menghentikan pergerakan robot dengan cara membatalkan goal yang telah dikirimkan sebelumnya. Fitur ini hanya berfungsi di mode `Navigation Goal`                                                       |
| Kontrol Kecepatan      | Fitur ini memungkinkan pengguna untuk mengontrol kecepatan pergerakan robot di mode `Joystick`. Satuan kecepatan `Linear` adalah `meter per second`, sedangkan satuan kecepatan `Angular` adalah `radian per second`. |
| Pose                   | Menampilkan informasi posisi dan orientasi dari robot                                                                                                                                                                 |
| Logs                   | Menampilkan feedback dari perintah yang diberikan oleh pengguna                                                                                                                                                       |

## Pengembangan Selanjutnya   

Berikut adalah beberapa tips untuk pengembang selanjutnya yang akan mengerjakan projek ini:
- Pakai VS Code editor
- Install ekstensi [ES6 String HTML](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html)   
  `Ekstensi ini berfungsi untuk mewarnai syntax html yang terdapat di dalam vue components`

  Arsitektur 
-----------

1. Arsitektur Komunikasi 

Project kembangkan adalah aplikasi berbasis web yang menggunakan library bernama RoslibJS agar aplikasi tersebut dapat berinteraksi dengan robot AGV yang kami kembangkan. Konsep komunikasi antara aplikasi dengan robot adalah sebagai berikut. Aplikasi web menggunakan library RoslibJS untuk melakukan komunikasi ke robot menggunakan protokol websocket. Rosbridge yang berjalan pada sisi robot akan merespon instruksi yang diberikan aplikasi web melalui koneksi websocket. Kemudian Roscore yang dijalankan pada robot berfungsi untuk mengatur komunikasi antar ROS node. Jadi, perintah yang diterima dari aplikasi web melalui rosbridge dapat diproses dan diteruskan ke ROS node yang lain.


<img src="/public/assets/images/doc/komunikasi.PNG">



2. Arsitektur Software

Untuk pengembangan project software kami menggunakan framework vuejs dan tailwind untuk mengatur interface dan library roslibjs untuk melakukan komunikasi menggunakan websocket. Selanjutnya project di-build dan menghasilkan sebuah aplikasi web.


<img src="/public/assets/images/doc/software.PNG">


## Referensi

[1] [Contoh Penggunaan ROS2DJS](http://wiki.ros.org/ros2djs/Tutorials/VisualizingAMap)  
[2] [Contoh Penggunaan NAV2DJS](http://wiki.ros.org/nav2djs/Tutorials/CreatingABasicNav2DWidget)  
[3] [Dokumentasi Vue JS](https://vuejs.org/guide/introduction.html)  
[4] [VueX Untuk State Management](https://vuex.vuejs.org)  
[5] [Vue Router](https://router.vuejs.org)  
[6] [Playlist Tentang Membuat UI Untuk Robot Berbasi ROS](https://www.youtube.com/playlist?list=PLK0b4e05LnzagmZCkKIQo9KKqtGo_3aKj)
