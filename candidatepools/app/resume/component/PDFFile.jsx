import React from 'react';
import { Page, Text, Document, StyleSheet, View, Image, Font } from '@react-pdf/renderer';

// Define the styles for the PDF document
Font.register({
  family: 'THSarabunNew',
  src: '/assert/fonts/Sarabun.ttf'
});
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    fontFamily: 'THSarabunNew'
  },
  leftSection: {
    width: '30%',
    paddingRight: 10,
  },
  rightSection: {
    width: '70%',
    paddingLeft: 10,
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  image: {
    width: 100,
    height: 100,
  },
  profile: {
    padding: 20,
    backgroundColor: 'yellow',
    
  },
  contentLeft: {
    padding: 20,
    backgroundColor: 'red',
    height: "100%",
  }
});

const PDFFile = ({ dataUser, dataSkills, dataEducations, dataHistoryWork, yearToday }) => {
  return (
    <Document>
      <Page style={styles.container}>
        <View style={styles.leftSection}>
          <View style={styles.profile}>
            <Image
              style={styles.image}
              source={dataUser.profile || "/image/main/user.png"}
              alt="Profile Picture"
            />
          </View>
          <View style={styles.contentLeft}>
            <Text style={styles.header}>เกี่ยวกับฉัน</Text>
            <Text style={styles.text}>อายุ: {yearToday - dataUser.yearBirthday || "-"}</Text>
            <Text style={styles.text}>ที่อยู่: ตำบล{dataUser.addressTambon} อำเภอ{dataUser.addressAmphor} จังหวัด{dataUser.addressProvince} {dataUser.addressZipCode}</Text>
            <Text style={styles.text}>เบอร์โทร: {dataUser.tel || "-"}</Text>
            <Text style={styles.text}>อีเมล์: {dataUser.email || "-"}</Text>

            <Text style={styles.header}>ทักษะ</Text>
            {dataSkills?.skills?.map((skill, index) => (
              <Text key={index} style={styles.text}>{skill.name || "-"}</Text>
            ))}
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.header}>{dataUser.firstName} {dataUser.lastName}</Text>

          <Text style={styles.header}>การศึกษา</Text>
          {dataEducations?.university?.map((education, index) => (
            <View key={index} style={styles.text}>
              <Text>{dataEducations.educationLevel[index] || "-"}</Text>
              <Text>{dataEducations.university[index] || "-"}</Text>
              <Text>คณะ{dataEducations.faculty[index] || "-"}</Text>
              <Text>สาขา{dataEducations.branch[index] || "-"}</Text>
              <Text>ปีที่จบการศึกษา: {dataEducations.yearGraduation[index] || "-"}</Text>
              <Text>เกรดเฉลี่ย: {dataEducations.grade[index] || "-"}</Text>
            </View>
          ))}

          <Text style={styles.header}>ประสบการณ์ฝึกงาน</Text>
          {dataHistoryWork?.internships?.map((e, index) => (
            <View key={index} style={styles.text}>
              <Text>{e.dateStart} - {e.dateEnd}</Text>
              <Text>สถานที่ฝึกงาน: {e.place}</Text>
              <Text>ตำแหน่ง: {e.position}</Text>
            </View>
          ))}

          <Text style={styles.header}>ประสบการณ์ทำงาน</Text>
          {dataHistoryWork?.workExperience?.map((e, index) => (
            <View key={index} style={styles.text}>
              <Text>{e.dateStart} - {e.dateEnd}</Text>
              <Text>สถานที่ทำงาน: {e.place}</Text>
              <Text>ตำแหน่ง: {e.position}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PDFFile;
