import React from "react";
import {
  Page,
  Text,
  Document,
  StyleSheet,
  View,
  Image,
  Font,
} from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

// Define the styles for the PDF document
Font.register({
  family: "THSarabunNew",
  fonts: [
    {
      src: "/assert/fonts/ibm-plex-sans-thai-thai-300-normal.ttf",
      fontWeight: "light", // น้ำหนัก Light (300)
    },
    {
      src: "/assert/fonts/ibm-plex-sans-thai-thai-400-normal.ttf",
      fontWeight: "normal", // น้ำหนัก Regular (400)
    },
    {
      src: "/assert/fonts/ibm-plex-sans-thai-thai-700-normal.ttf",
      fontWeight: "bold", // น้ำหนัก Bold (700)
    },
  ],
});

const styles = StyleSheet.create({
  container: {
    fontFamily: "THSarabunNew",
  },
  fontNameThai: {
    fontSize: "2rem",
  },
  fontNameEng: {
    fontSize: "1.7rem",
  },
  hr: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
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

const PDFFile = ({
  type,
  dataUser,
  dataSkills,
  dataEducations,
  dataHistoryWork,
  yearToday,
}) => {
  return (
    <Document style={styles.container}>
      <Page style={tw("flex flex-row p-0 text-sm")}>
        {type === 1 ? (
          <View style={tw("flex flex-row overflow-hidden border w-full")}>
            {/* Left Section */}
            <View style={tw("w-1/3 text-white ")}>
              <View
                style={tw(
                  "bg-[#fea661] pb-10 pt-5 flex flex-row justify-center"
                )}
              >
                <Image
                  src={dataUser.profile || "/image/main/user.png"}
                  style={tw("w-32 h-32")}
                />
              </View>
              <View style={tw("bg-[#f48e07] h-full")}>
                <View style={tw("p-5")}>
                  <Text style={tw("text-xl font-bold")}>ข้อมูลส่วนตัว</Text>
                  <View style={tw("flex flex-col gap-y-2")}>
                    {/* <Text>อายุ: {yearToday - dataUser.yearBirthday || "-"}</Text> */}
                    <View style={tw("flex flex-row gap-1 flex-wrap")}>
                      <Text>
                        วันเกิด: {dataUser.dateBirthday || "-"}{" "}
                        {dataUser.monthBirthday || "-"}{" "}
                        {dataUser.yearBirthday || "-"}
                      </Text>
                      <Text>
                        ({yearToday - dataUser.yearBirthday || "-"}ปี)
                      </Text>
                    </View>
                    <View style={tw("flex flex-row gap-1 flex-wrap")}>
                      <Text>ความพิการ: </Text>
                      {dataUser?.typeDisabled?.map((d, index) => (
                        <Text key={index}>{d || " - "}</Text>
                      ))}
                    </View>
                    <View style={tw("flex flex-row flex-wrap gap-1")}>
                      <Text>ที่อยู่: {dataUser.address}</Text>
                      <Text>
                        {" "}
                        {dataUser.addressProvince === "กรุงเทพมหานคร"
                          ? "เขต"
                          : "ตำบล"}
                        {dataUser.addressTambon}
                      </Text>
                      <Text>
                        {" "}
                        {dataUser.addressProvince === "กรุงเทพมหานคร"
                          ? "แขวง"
                          : "อำเภอ"}
                        {dataUser.addressAmphor}
                      </Text>
                      <Text>จังหวัด{dataUser.addressProvince}</Text>
                      <Text>รหัสไปรษณีย์ {dataUser.addressZipCode}</Text>
                    </View>
                    <View style={tw("flex flex-row gap-1 whitespace-nowrap")}>
                      <Text>เบอร์โทร: {dataUser.tel || "-"}</Text>
                    </View>
                    <Text style={tw("whitespace-nowrap")}>
                      อีเมล์: {dataUser.email || "-"}
                    </Text>
                  </View>
                </View>
                <View>
                  <View style={tw("p-5")}>
                    {dataSkills?.skills?.length > 0 && (
                      <Text style={tw("text-xl font-bold")}>ทักษะ</Text>
                    )}
                    <View style={tw("flex flex-col gap-y-2")}>
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
            <View style={tw("w-2/3 p-5 px-10")}>
              <View style={tw("flex flex-col gap-5 mt-10")}>
                <Text style={[styles.fontNameThai, tw("font-bold ")]}>
                  {dataUser.firstName} {dataUser.lastName}
                </Text>
                <Text style={[styles.fontNameEng, tw("font-bold capitalize")]}>
                  {dataUser.firstNameEng} {dataUser.lastNameEng}
                </Text>
              </View>
              {dataEducations?.grade?.length > 0 && (
                <View style={tw("mt-10")}>
                  <Text style={tw("text-xl font-bold")}>การศึกษา</Text>
                  <View style={tw("flex flex-row flex-wrap gap-5")}>
                    {dataEducations?.university?.map((education, index) => (
                      <View key={index}>
                        <View style={tw("flex flex-row flex-wrap gap-2")}>
                          <Text>
                            {dataEducations.educationLevel[index] || "-"}
                          </Text>
                          <Text>{dataEducations.university[index] || "-"}</Text>
                          <Text>คณะ{dataEducations.faculty[index] || "-"}</Text>
                          <Text>สาขา{dataEducations.branch[index] || "-"}</Text>
                          {dataEducations?.typePerson === "นักศึกษาพิการ" &&
                          index === 0 ? (
                            <Text>
                              กำลังศึกษา: ชั้นปีที่ {dataEducations.level}
                            </Text>
                          ) : (
                            <Text>
                              ปีที่จบการศึกษา:{" "}
                              {dataEducations.yearGraduation[index] || "-"}
                            </Text>
                          )}
                          <Text>
                            เกรดเฉลี่ย: {dataEducations.grade[index] || "-"}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={tw("mt-10")}>
                {dataHistoryWork?.internships?.length > 0 && (
                  <Text style={tw("text-xl font-bold")}>ประสบการณ์ฝึกงาน</Text>
                )}
                <View style={tw("flex flex-row flex-wrap gap-5")}>
                  {dataHistoryWork?.internships?.map((e, index) => (
                    <View key={index}>
                      <View style={tw("flex flex-row flex-wrap gap-2")}>
                        <View style={tw("w-full")}>
                          <Text>
                            {e.dateStart} - {e.dateEnd}
                          </Text>
                        </View>
                        <Text>สถานที่ฝึกงาน: {e.place}</Text>
                        <Text>ตำแหน่ง: {e.position}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={tw("mt-10")}>
                {dataHistoryWork?.workExperience?.length > 0 && (
                  <Text style={tw("text-xl font-bold")}>ประสบการณ์ทำงานน</Text>
                )}
                <View style={tw("flex flex-row flex-wrap gap-5")}>
                  {dataHistoryWork?.workExperience?.map((e, index) => (
                    <View key={index}>
                      <View style={tw("flex flex-row flex-wrap gap-2")}>
                        <View style={tw("w-full")}>
                          <Text>
                            {e.dateStart} - {e.dateEnd}
                          </Text>
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
        ) : type === 2 ? (
          <View style={tw(" flex flex-col overflow-hidden border w-full")}>
            {/* Top Section */}
            <View
              style={tw(
                "bg-[#f48e07] text-white flex flex-row items-center gap-10"
              )}
            >
              <View style={tw("bg-[#fea661] p-5 flex flex-row justify-center")}>
                <Image
                  src={dataUser.profile || "/image/main/user.png"}
                  style={tw("w-32 h-32")}
                />
              </View>
              <View style={tw("flex flex-col gap-5")}>
                <Text style={[styles.fontNameThai, tw("font-bold ")]}>
                  {dataUser.firstName} {dataUser.lastName}
                </Text>
                <Text style={[styles.fontNameEng, tw("font-bold capitalize")]}>
                  {dataUser.firstNameEng} {dataUser.lastNameEng}
                </Text>
              </View>
            </View>
            <View style={tw("pt-5 flex flex-row gap-10")}>
              {/*Bottom Left Section */}
              <View style={tw("flex flex-col gap-5 w-56 ")}>
                <View style={tw("px-5")}>
                  <Text style={tw("text-xl font-bold")}>ข้อมูลส่วนตัว</Text>
                  <View style={tw("flex flex-col gap-y-2")}>
                    {/* <Text>อายุ: {yearToday - dataUser.yearBirthday || "-"}</Text> */}
                    <View style={tw("flex flex-row gap-2 flex-wrap")}>
                      <Text>
                        วันเกิด: {dataUser.dateBirthday || "-"}{" "}
                        {dataUser.monthBirthday || "-"}{" "}
                        {dataUser.yearBirthday || "-"}
                      </Text>
                      <Text>
                        ({yearToday - dataUser.yearBirthday || "-"}ปี)
                      </Text>
                    </View>
                    <View style={tw("flex flex-row gap-1 flex-wrap")}>
                      <Text>ความพิการ: </Text>
                      {dataUser?.typeDisabled?.map((d, index) => (
                        <Text key={index}>{d || " - "}</Text>
                      ))}
                    </View>
                    <View style={tw("flex flex-row flex-wrap gap-1")}>
                      <Text>ที่อยู่: {dataUser.address}</Text>
                      <Text>
                        {" "}
                        {dataUser.addressProvince === "กรุงเทพมหานคร"
                          ? "เขต"
                          : "ตำบล"}
                        {dataUser.addressTambon}
                      </Text>
                      <Text>
                        {" "}
                        {dataUser.addressProvince === "กรุงเทพมหานคร"
                          ? "แขวง"
                          : "อำเภอ"}
                        {dataUser.addressAmphor}
                      </Text>
                      <Text>จังหวัด{dataUser.addressProvince}</Text>
                      <Text>รหัสไปรษณีย์ {dataUser.addressZipCode}</Text>
                    </View>
                    <View style={tw("flex flex-row gap-1 ")}>
                      <Text>เบอร์โทร: {dataUser.tel || "-"}</Text>
                    </View>
                    <Text style={tw("")}>อีเมล์: {dataUser.email || "-"}</Text>
                  </View>
                </View>
                {dataEducations?.grade?.length > 0 && (
                  <View style={tw("px-5")}>
                    <Text style={tw("text-xl font-bold")}>การศึกษา</Text>
                    <View style={tw(" flex flex-row flex-wrap gap-5")}>
                      {dataEducations?.university?.map((education, index) => (
                        <View key={index}>
                          <View style={tw("flex flex-row flex-wrap gap-2")}>
                            <Text>
                              {dataEducations.educationLevel[index] || "-"}
                            </Text>
                            <Text>
                              {dataEducations.university[index] || "-"}
                            </Text>
                            <Text>
                              คณะ {dataEducations.faculty[index] || "-"}
                            </Text>
                            <Text>
                              สาขา {dataEducations.branch[index] || "-"}
                            </Text>
                            {dataEducations?.typePerson === "นักศึกษาพิการ" &&
                            index === 0 ? (
                              <Text>
                                กำลังศึกษา: ชั้นปีที่ {dataEducations.level}
                              </Text>
                            ) : (
                              <Text>
                                ปีที่จบการศึกษา:{" "}
                                {dataEducations.yearGraduation[index] || "-"}
                              </Text>
                            )}
                            <Text>
                              เกรดเฉลี่ย: {dataEducations.grade[index] || "-"}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                <View>
                  <View style={tw("px-5")}>
                    {dataSkills?.skills?.length > 0 && (
                      <Text style={tw("text-xl font-bold")}>ทักษะ</Text>
                    )}
                    <View style={tw("flex flex-col gap-y-2")}>
                      {dataSkills?.skills?.map((skill, index) => (
                        <View key={index}>
                          <Text>{skill.name || "-"}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
              {/*Bottom Right Section */}
              <View style={tw("flex flex-col w-2/3 px-2 gap-10")}>
                {dataHistoryWork?.internships?.length > 0 && (
                  <View style={tw("")}>
                    <Text style={tw("text-xl font-bold")}>
                      ประสบการณ์ฝึกงาน
                    </Text>
                    <View style={tw(" flex flex-row flex-wrap gap-5")}>
                      {dataHistoryWork?.internships?.map((e, index) => (
                        <View key={index}>
                          <View style={tw("flex flex-row flex-wrap gap-2")}>
                            <View style={tw("w-full")}>
                              <Text>
                                {e.dateStart} - {e.dateEnd}
                              </Text>
                            </View>
                            <Text>สถานที่ฝึกงาน: {e.place}</Text>
                            <Text>ตำแหน่ง: {e.position}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                {dataHistoryWork?.workExperience?.length > 0 && (
                  <View style={tw("")}>
                    <Text style={tw("text-xl font-bold")}>
                      ประสบการณ์ทำงานน
                    </Text>
                    <View style={tw(" flex flex-row flex-wrap gap-5")}>
                      {dataHistoryWork?.workExperience?.map((e, index) => (
                        <View key={index}>
                          <View style={tw("flex flex-row flex-wrap gap-2")}>
                            <View style={tw("w-full")}>
                              <Text>
                                {e.dateStart} - {e.dateEnd}
                              </Text>
                            </View>
                            <Text>สถานที่ทำงาน: {e.place}</Text>
                            <Text>ตำแหน่ง: {e.position}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        ) : (
          <View style={tw(" flex flex-col overflow-hidden border w-full")}>
            {/* Top Section */}
            <View style={tw(" text-black flex flex-row items-center ")}>
              <View style={tw(" pt-5 px-14 flex flex-row justify-center")}>
                <Image
                  src={dataUser.profile || "/image/main/user.png"}
                  style={tw("w-32 h-32")}
                />
              </View>
              <View style={tw("flex flex-col gap-5")}>
                <Text style={[styles.fontNameThai, tw("font-bold ")]}>
                  {dataUser.firstName} {dataUser.lastName}
                </Text>
                <Text
                  style={[
                    styles.fontNameEng,
                    tw("font-bold capitalize text-gray-500"),
                  ]}
                >
                  {dataUser.firstNameEng} {dataUser.lastNameEng}
                </Text>
              </View>
            </View>
            <View style={tw("mx-10 flex flex-row gap-5")}>
              {/*Bottom Section */}
              <View style={tw("flex flex-col ")}>
                <View style={tw("")}>
                  <View style={[styles.hr, tw("my-5")]}></View>
                  <Text style={tw("text-xl font-bold")}>ข้อมูลส่วนตัว</Text>
                  <View style={tw("flex flex-col gap-y-2 px-5")}>
                    {/* <Text>อายุ: {yearToday - dataUser.yearBirthday || "-"}</Text> */}
                    <View style={tw("flex flex-row gap-2 flex-wrap")}>
                      <Text>
                        วันเกิด: {dataUser.dateBirthday || "-"}{" "}
                        {dataUser.monthBirthday || "-"}{" "}
                        {dataUser.yearBirthday || "-"}
                      </Text>
                      <Text>
                        ({yearToday - dataUser.yearBirthday || "-"}ปี)
                      </Text>
                    </View>
                    <View style={tw("flex flex-row gap-1 flex-wrap")}>
                      <Text>ความพิการ: </Text>
                      {dataUser?.typeDisabled?.map((d, index) => (
                        <Text key={index}>{d || " - "}</Text>
                      ))}
                    </View>
                    <View style={tw("flex flex-row flex-wrap gap-1")}>
                      <Text>ที่อยู่: {dataUser.address}</Text>
                      <Text>
                        {" "}
                        {dataUser.addressProvince === "กรุงเทพมหานคร"
                          ? "เขต"
                          : "ตำบล"}
                        {dataUser.addressTambon}
                      </Text>
                      <Text>
                        {" "}
                        {dataUser.addressProvince === "กรุงเทพมหานคร"
                          ? "แขวง"
                          : "อำเภอ"}
                        {dataUser.addressAmphor}
                      </Text>
                      <Text>จังหวัด{dataUser.addressProvince}</Text>
                      <Text>รหัสไปรษณีย์ {dataUser.addressZipCode}</Text>
                    </View>
                    <View style={tw("flex flex-row gap-1 ")}>
                      <Text>เบอร์โทร: {dataUser.tel || "-"}</Text>
                    </View>
                    <Text style={tw("")}>อีเมล์: {dataUser.email || "-"}</Text>
                  </View>
                </View>

                {dataEducations?.grade?.length > 0 && (
                  <View style={tw("")}>
                    <View style={[styles.hr, tw("my-5")]}></View>
                    <Text style={tw("text-xl font-bold")}>การศึกษา</Text>
                    <View style={tw(" flex flex-wrap gap-2 px-5")}>
                      {dataEducations?.university?.map((education, index) => (
                        <View key={index}>
                          <View style={tw("flex flex-row flex-wrap gap-2")}>
                            <Text>
                              {dataEducations.educationLevel[index] || "-"}
                            </Text>
                            <Text>
                              {dataEducations.university[index] || "-"}
                            </Text>
                            <Text>
                              คณะ{dataEducations.faculty[index] || "-"}
                            </Text>
                            <Text>
                              สาขา{dataEducations.branch[index] || "-"}
                            </Text>
                            {dataEducations?.typePerson === "นักศึกษาพิการ" &&
                            index === 0 ? (
                              <Text>
                                กำลังศึกษา: ชั้นปีที่ {dataEducations.level}
                              </Text>
                            ) : (
                              <Text>
                                ปีที่จบการศึกษา:{" "}
                                {dataEducations.yearGraduation[index] || "-"}
                              </Text>
                            )}
                            <Text>
                              เกรดเฉลี่ย: {dataEducations.grade[index] || "-"}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View>
                  <View style={tw("")}>
                    {dataSkills?.skills?.length > 0 && (
                      <>
                        <View style={[styles.hr, tw("my-5")]}></View>
                        <Text style={tw("text-xl font-bold")}>ทักษะ</Text>
                      </>
                    )}
                    <View style={tw("flex flex-col gap-y-2 px-5")}>
                      {dataSkills?.skills?.map((skill, index) => (
                        <View key={index}>
                          <Text>{skill.name || "-"}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={tw("")}>
                  {dataHistoryWork?.internships?.length > 0 && (
                    <>
                      <View style={[styles.hr, tw("my-5")]}></View>
                      <Text style={tw("text-xl font-bold")}>
                        ประสบการณ์ฝึกงาน
                      </Text>
                    </>
                  )}
                  <View style={tw(" flex flex-row flex-wrap gap-2 px-5")}>
                    {dataHistoryWork?.internships?.map((e, index) => (
                      <View key={index}>
                        <View style={tw("flex flex-row flex-wrap gap-2")}>
                          <View style={tw("w-full")}>
                            <Text>
                              {e.dateStart} - {e.dateEnd}
                            </Text>
                          </View>
                          <Text>สถานที่ฝึกงาน: {e.place}</Text>
                          <Text>ตำแหน่ง: {e.position}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={tw("")}>
                  {dataHistoryWork?.workExperience?.length > 0 && (
                    <>
                      <View style={[styles.hr, tw("my-5")]}></View>
                      <Text style={tw("text-xl font-bold")}>
                        ประสบการณ์ทำงานน
                      </Text>
                    </>
                  )}
                  <View style={tw(" flex flex-row flex-wrap gap-2 px-5")}>
                    {dataHistoryWork?.workExperience?.map((e, index) => (
                      <View key={index}>
                        <View style={tw("flex flex-row flex-wrap gap-2")}>
                          <View style={tw("w-full")}>
                            <Text>
                              {e.dateStart} - {e.dateEnd}
                            </Text>
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
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PDFFile;
