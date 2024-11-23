import React from 'react';
import { Page, Text, Document, StyleSheet, View, Image, Font } from '@react-pdf/renderer';
import { createTw } from "react-pdf-tailwind";

// Define the styles for the PDF document
Font.register({
  family: 'THSarabunNew',
  src: '/assert/fonts/Sarabun-medium.ttf'
});

const styles = StyleSheet.create({
  container: {
    fontFamily: 'THSarabunNew'
  },
  fontNameThai: {
    fontSize: '2rem'
  },
  fontNameEng: {
    fontSize: '1.7rem'
  },
});

const tw = createTw({
  theme: {
    fontFamily: {
      sans: ["Comic Sans"],
    },
    extend: {
      colors: {
        custom: "#bada55",
      },
    },
  },
});

const PDFFile = ({ dataUser, dataSkills, dataEducations, dataHistoryWork, yearToday }) => {
  return (
    <Document style={styles.container}>
      <Page style={tw('flex flex-row p-0 text-sm')}>
        <View style={tw('flex flex-row overflow-hidden border w-full')}>
          {/* Left Section */}
          <View style={tw('w-1/3 text-white ')}>
            <View style={tw('bg-[#fea661] pb-10 pt-5 flex flex-row justify-center')}>
              <Image
                src={dataUser.profile || "/image/main/user.png"}
                style={tw('max-w-40 max-h-52')}
              />
            </View>
            <View style={tw('bg-[#f48e07] h-full')}>
              <View style={tw('p-5')}>
                <Text style={tw('text-xl font-bold')}>เกี่ยวกับฉัน</Text>
                <View style={tw('flex flex-col mt-2 gap-y-2')}>
                  <Text>อายุ: {yearToday - dataUser.yearBirthday || "-"}</Text>
                  <View style={tw('flex flex-row flex-wrap gap-1')}>
                    <Text>ที่อยู่: </Text>
                    <Text>ตำบล{dataUser.addressTambon}</Text>
                    <Text>อำเภอ{dataUser.addressAmphor}</Text>
                    <Text>จังหวัด{dataUser.addressProvince}</Text>
                    <Text>รหัสไปรษณีย์ {dataUser.addressZipCode}</Text>
                  </View>
                  <View style={tw('flex flex-row gap-1 whitespace-nowrap')}>
                    <Text>เบอร์โทร: {dataUser.tel || "-"}</Text>
                  </View>
                  <Text style={tw('whitespace-nowrap')}>อีเมล์: {dataUser.email || "-"}</Text>
                </View>
              </View>
              <View>
                <View style={tw('p-5')}>


                  {dataHistoryWork?.workExperience?.length > 0 && (
                    <Text style={tw('text-xl font-bold')}>ทักษะ</Text>
                  )}
                  <View style={tw('flex flex-col mt-2 gap-y-2')}>
                    {dataSkills?.skills?.map((skill, index) => (
                      <View key={index}>
                        <Text>{skill.name || "-"}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Right Section */}
          <View style={tw('w-2/3 p-5 px-10')}>
            <View style={tw('flex flex-col gap-5')}>
              <Text style={[styles.fontNameThai, tw('font-bold ')]}>{dataUser.firstName} {dataUser.lastName}</Text>
              <Text style={[styles.fontNameEng, tw('font-bold capitalize')]}>{dataUser.firstNameEng} {dataUser.lastNameEng}</Text>
            </View>
            {dataEducations?.grade?.length > 0 && (
              <View style={tw('mt-10')}>
                <Text style={tw('text-xl font-bold')}>การศึกษา</Text>
                <View style={tw('mt-2 flex flex-wrap gap-5')}>
                  {dataEducations?.university?.map((education, index) => (
                    <View key={index}>
                      <View style={tw('flex flex-row flex-wrap gap-2')}>
                        <Text>{dataEducations.educationLevel[index] || "-"}</Text>
                        <Text>{dataEducations.university[index] || "-"}</Text>
                        <Text>คณะ{dataEducations.faculty[index] || "-"}</Text>
                        <Text>สาขา{dataEducations.branch[index] || "-"}</Text>
                        {dataEducations.yearGraduation[index] ? (
                          <Text>ปีที่จบการศึกษา: {dataEducations.yearGraduation[index] || "-"}</Text>
                        ) : (
                          <Text>กำลังศึกษา: ชั้นปีที่ {dataEducations.level}</Text>
                        )}
                        <Text>เกรดเฉลี่ย: {dataEducations.grade[index] || "-"}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={tw('mt-10')}>
              {dataHistoryWork?.workExperience?.length > 0 && (
                <Text style={tw('text-xl font-bold')}>ประสบการณ์ฝึกงาน</Text>
              )}
              <View style={tw('mt-2 flex flex-row flex-wrap gap-5')}>
                {dataHistoryWork?.internships?.map((e, index) => (
                  <View key={index}>
                    <View style={tw('flex flex-row flex-wrap gap-2')}>
                      <View style={tw('w-full')}>
                        <Text>{e.dateStart} - {e.dateEnd}</Text>
                      </View>
                      <Text>สถานที่ฝึกงาน: {e.place}</Text>
                      <Text>ตำแหน่ง: {e.position}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={tw('mt-10')}>
              {dataHistoryWork?.workExperience?.length > 0 && (
                <Text style={tw('text-xl font-bold')}>ประสบการณ์ทำงานน</Text>
              )}
              <View style={tw('mt-2 flex flex-row flex-wrap gap-5')}>
                {dataHistoryWork?.workExperience?.map((e, index) => (
                  <View key={index}>
                    <View style={tw('flex flex-row flex-wrap gap-2')}>
                      <View style={tw('w-full')}>
                        <Text>{e.dateStart} - {e.dateEnd}</Text>
                      </View>
                      <Text>สถานที่ทำงาน: {e.place}</Text>
                      <Text>ตำแหน่ง: {e.position}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default PDFFile;
