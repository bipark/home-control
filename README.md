# home-control
라즈베리파이, Node.js, React-Naitve를 이용한 홈 컨트롤 시스템

# 만든 계기

약 2주간 주말에 재미삼아 만든 프로젝트 입니다. 처음엔 아두이노만 하려고 했는데 일이 커져 버렸네요. 알리익스프레스에서 wifi가 달린 아두이노를 발견하고 <https://ko.aliexpress.com/item/ESP-12E-WeMos-D1-WiFi-uno-based-ESP8266-shield-for-arduino-Compatible/32719426362.html?spm=2114.13010608.0.0.Kro7h8> 코딩 한번 해보려고 시작한 일이 커져 벼렸습니다.

처음 만든것은 이런 모양 이었습니다. 컨트롤 스위치 (페북 링크 참조)   <https://www.facebook.com/rtlink.park/posts/1765804983435531> 이걸 브라우저 주소로 컨트롤 할 수 있게 만들었는데 기왕 만들고 보니 서버와 앱이 있으면 좋겠다 싶어서 현재 리포와 같은 작업을 했습니다.

기왕에 시작한 일을 중지 하기가 싫어서 만든 소스라서 예쁘게 정리 하지 못하고 올려 놓습니다. 대충 개념만 참조 히시면 좋겠습니다. 시간이 나는대로 업데이트 해보도록 애써 보겠습니다.

# 구동방식

1. 아두이노에 전원이 인가되면 아두이노 내부에 웹서버를 기동하고 와이파이를 연결하고 서버에 접속해서 자신의 number, ip, name를 전송합니다.
2. 서버는 전송받은 정보를 DB(MySQL)에 저장합니다.
3. 모바일앱은 기동하면서 서버에 접속하여 Device List Request 합니다. 받은 리스트를 이용하여 화면을 만들고 사용자의 액션을 기다립니다.
4. 사용자가 앱 스위치를 On/Off 하면 서버로 ip, Status가 전달되고 서버를 Device에 On/Off 메세지를 전달하여 On/Off 를 수행 합니다.

# 앱구동화면

![](https://github.com/bipark/home-control/docs/appscr1.png)

# 추후 예정작업
1. 원래는 앱을 실행하면 서버에서 디비이스의 상태를 모두 확인하고 현재 디바이스별 On/Off 상태를 앱에 전달해 줘야 하는데, 아두이노에 상태 확인 코드 까지는 넣어 놨는데 서버에서 확인하는 과정이 없습니다. (2017-7-8 완료)
2. 서버 페이지 - 웹으로 접근해서 스위치 온오프 하려고 ExpressJS를 셋팅만 해놨습니다.
2. 귀찮음 병이 좀 나아지면 하겠습니다.

# 서버 환경 설정

1. MySQL 테이블 구조
```
CREATE TABLE `switches` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `number` int(11) NOT NULL,
    `ip` varchar(15) NOT NULL DEFAULT '',
    `title` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `number` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
```
2. npm install
3. npm start


# React Native
1. npm install
2. npm start
3. react-native run-ios or react-native run-android
4. 아이폰과 안드로이드에서 잘 동작 합니다만 UI 구립니다.


# 프로젝트 폴더의 구조
1. [app] - React Native 기반의 앱 폴더
2. [server] - Node.js 홈서버
3. [arduino] - 아두이노 소스 코드

# 라이센스
MIT 입니다. 맘대로 사용하셔도 됩니다. 대신 책임지지 않습니다. ㅋ 

# Contact
BILLY PARK - rtlink.park@gmail.com

