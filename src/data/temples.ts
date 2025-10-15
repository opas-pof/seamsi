export interface Temple {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
}

export const temples: Temple[] = [
  {
    id: "wat-phra-kaew",
    name: "วัดพระแก้ว",
    description: "วัดพระศรีรัตนศาสดาราม หรือที่รู้จักกันในนาม วัดพระแก้ว เป็นวัดที่ตั้งอยู่ในพระบรมมหาราชวัง มีความศักดิ์สิทธิ์และเป็นที่เคารพนับถือของคนไทย",
    location: "กรุงเทพมหานคร",
    image: "/temples/wat-phra-kaew.jpg"
  },
  {
    id: "wat-arun",
    name: "วัดอรุณราชวราราม",
    description: "วัดอรุณฯ หรือวัดแจ้ง เป็นวัดเก่าแก่ริมฝั่งธนบุรี มีพระปรางค์อันงดงามเป็นสัญลักษณ์ มีความสวยงามทั้งกลางวันและกลางคืน",
    location: "กรุงเทพมหานคร",
    image: "/temples/wat-arun.jpg"
  },
  {
    id: "wat-pho",
    name: "วัดโพธิ์",
    description: "วัดพระเชตุพนวิมลมังคลาราม หรือวัดโพธิ์ เป็นวัดเก่าแก่ในกรุงเทพฯ มีพระนอนขนาดใหญ่ และเป็นแหล่งเรียนรู้การนวดแผนไทย",
    location: "กรุงเทพมหานคร",
    image: "/temples/wat-pho.jpg"
  },
  {
    id: "wat-saket",
    name: "วัดสระเกศ",
    description: "วัดสระเกศราชวรมหาวิหาร เป็นที่ตั้งของภูเขาทอง จุดชมวิวที่สวยงามของกรุงเทพฯ มีเทศกาลงานภูเขาทองที่มีชื่อเสียง",
    location: "กรุงเทพมหานคร",
    image: "/temples/wat-saket.jpg"
  },
  {
    id: "wat-benchamabophit",
    name: "วัดเบญจมบพิตร",
    description: "วัดเบญจมบพิตรดุสิตวนาราม หรือวัดหินอ่อน เป็นวัดที่สร้างด้วยหินอ่อนจากอิตาลี มีสถาปัตยกรรมที่งดงามผสมผสานระหว่างไทยและตะวันตก",
    location: "กรุงเทพมหานคร",
    image: "/temples/wat-benchamabophit.jpg"
  },
  {
    id: "wat-suthat",
    name: "วัดสุทัศน์",
    description: "วัดสุทัศนเทพวราราม เป็นวัดหลวงที่มีความสำคัญทางประวัติศาสตร์ มีเสาชิงช้าขนาดใหญ่ตั้งอยู่หน้าวัด",
    location: "กรุงเทพมหานคร",
    image: "/temples/wat-suthat.jpg"
  },
  {
    id: "wat-ratchanatdaram",
    name: "วัดราชนัดดาราม",
    description: "วัดราชนัดดารามวรวิหาร เป็นวัดที่มีโลหะปราสาทอันงดงาม สถาปัตยกรรมที่มีเอกลักษณ์เฉพาะตัว",
    location: "กรุงเทพมหานคร",
    image: "/temples/wat-ratchanatdaram.jpg"
  },
  {
    id: "wat-traimit",
    name: "วัดไตรมิตร",
    description: "วัดไตรมิตรวิทยารามวรวิหาร เป็นที่ประดิษฐานของพระพุทธรูปทองคำบริสุทธิ์ที่ใหญ่ที่สุดในโลก",
    location: "กรุงเทพมหานคร",
    image: "/temples/wat-traimit.jpg"
  },
  {
    id: "wat-mahathat",
    name: "วัดมหาธาตุ",
    description: "วัดมหาธาตุยุวราชรังสฤษฎิ์ เป็นวัดที่สำคัญทางพระพุทธศาสนาและเป็นศูนย์กลางการเรียนรู้วิปัสสนากรรมฐาน",
    location: "กรุงเทพมหานคร",
    image: "/temples/wat-mahathat.jpg"
  },
  {
    id: "wat-bowonniwet",
    name: "วัดบวรนิเวศ",
    description: "วัดบวรนิเวศวิหาร เป็นวัดหลวงที่มีความสำคัญทางประวัติศาสตร์ เป็นที่ประทับของพระมหากษัตริย์ก่อนขึ้นครองราชย์",
    location: "กรุงเทพมหานคร",
    image: "/temples/wat-bowonniwet.jpg"
  },
  {
    id: "wat-ratchabophit",
    name: "วัดราชบพิธ",
    description: "วัดราชบพิธสถิตมหาสีมารามราชวรวิหาร เป็นวัดที่มีสถาปัตยกรรมผสมผสานระหว่างไทยและตะวันตกอย่างงดงาม",
    location: "กรุงเทพมหานคร",
    image: "/temples/wat-ratchabophit.jpg"
  },
  {
    id: "wat-pathum-wanaram",
    name: "วัดปทุมวนาราม",
    description: "วัดปทุมวนารามราชวรวิหาร เป็นวัดหลวงที่ตั้งอยู่ใจกลางเมือง มีความสงบและเป็นที่พักพิงทางใจ",
    location: "กรุงเทพมหานคร",
    image: "/temples/wat-pathum-wanaram.jpg"
  }
];
