"use client";

import React, { Suspense, useEffect, useState } from "react";
import ReactPDF, { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink, Image, Font } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Table } from "@david.kucsai/react-pdf-table/lib/Table";
import { TableHeader } from "@david.kucsai/react-pdf-table/lib/TableHeader";
import { TableCell } from "@david.kucsai/react-pdf-table/lib/TableCell";
import { DataTableCell } from "@david.kucsai/react-pdf-table/lib/DataTableCell";
import { TableBody } from "@david.kucsai/react-pdf-table/lib/TableBody";
import { createClient } from "@/utils/supabase/client";
import { Classroom, GradeLevelEnum, QuarterEnum, StudentInformation } from "@/lib/collection.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { columns } from "./student-info-column";
import { DataTable } from "./datatable";
import { compare } from "@/utils/sortString";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, getDaysInMonth, getMonth } from "date-fns";
import { Json } from "@/lib/database.types";
import { generateColumn } from "./attendance-column";
import { studentGradeColumns } from "./student-grades-column";

Font.register({
  family: "Arial Narrow",
  fonts: [
    { src: "/fonts/ARIALN.TTF" },
    { src: "/fonts/ARIALNI.TTF", fontStyle: "italic" },
    { src: "/fonts/ARIALNB.TTF", fontWeight: 700 },
    { src: "/fonts/ARIALNBI.TTF", fontStyle: "italic", fontWeight: 700 },
  ],
});
// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontFamily: "Arial Narrow",
    paddingBottom: 33,
  },
  logo: {
    width: 75,
    height: 75,
  },
  header: {
    display: "flex",
    flexDirection: "row",
  },
  marginPage: {
    paddingTop: 10,
    paddingBottom: 40,
    paddingLeft: 20,
    paddingRight: 20,
  },
  schoolInformationView: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    rowGap: 5,
  },
  titleView: {
    alignItems: "center",
  },
  titleText: {
    fontSize: 12,
    fontWeight: 700,
  },
  subtitleText: {
    fontSize: 6,
    fontStyle: "italic",
  },
  schoolInformationBottomView: {
    display: "flex",
    flexDirection: "row",
    fontSize: 13,
    paddingHorizontal: 20,
    columnGap: 20,
    fontWeight: 700,
    flexWrap: "wrap",
  },
  normalText: {
    fontWeight: 400,
  },
  tableCell: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: 700,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableCellName: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: 700,
    minWidth: 200,
  },
  tableCellBottomText: {
    fontSize: 7,
  },
  dataTableCell: {
    padding: 2,
  },
  dataTableCellName: {
    minWidth: 204,
    padding: 2,
  },
  dataTableCellAttendance: {
    padding: 2,
    textAlign: "center",
    fontSize: 12,
  },
});

// Table change to any for TS
const MyTable: any = Table;
const MyTableHeader: any = TableHeader;
const MyTableCell: any = TableCell;
const MyTableBody: any = TableBody;

// Create Document Component
const DocumentFirstSPF = ({ data, gradeLevel, section }: { data: StudentInformationType[]; gradeLevel: string; section: string }) => (
  <Document>
    <Page size='LEGAL' orientation='landscape' style={styles.page}>
      {/* BUONG PAGE */}
      <View style={styles.marginPage}>
        {/* header */}
        <View style={styles.header}>
          {/* logo */}
          <View>
            <Image style={styles.logo} source='deped logo' src='/deped_logo.png' />
          </View>
          {/* school information */}
          <View style={styles.schoolInformationView}>
            {/* Title */}
            <View style={styles.titleView}>
              <Text style={styles.titleText}>School Form 1 (SF 1) School Register</Text>
              <Text style={styles.subtitleText}>(This replaces Form 1, Master List & STS Form 2 - Family Background and Profile)</Text>
            </View>
            {/* School Information bottom */}
            <View style={styles.schoolInformationBottomView}>
              <Text>
                School ID <Text style={styles.normalText}>SR-10045-DV-01</Text>
              </Text>
              <Text>
                Region <Text style={styles.normalText}>IV-A</Text>
              </Text>
              <Text>
                Division <Text style={styles.normalText}>4A</Text>
              </Text>
              <Text>
                District <Text style={styles.normalText}>1</Text>
              </Text>
              <Text>
                School Name <Text style={styles.normalText}>Santa Rosa Elementary School Central I</Text>
              </Text>
              <Text>
                School Year <Text style={styles.normalText}>2023-2024</Text>
              </Text>
              <Text>
                Grade Level <Text style={styles.normalText}>{gradeLevel}</Text>
              </Text>
              <Text>
                Section <Text style={styles.normalText}>{section}</Text>
              </Text>
            </View>
          </View>
        </View>
        {/* body */}
        {/* Table */}
        <MyTable data={[...data]}>
          <MyTableHeader>
            <MyTableCell style={styles.tableCell}>LRN</MyTableCell>
            <MyTableCell style={styles.tableCell}>
              <Text>Name</Text>
              <Text style={styles.tableCellBottomText}>(Last Name, First Name, Middle Name)</Text>
            </MyTableCell>
            <MyTableCell style={styles.tableCell}>
              <Text>Sex</Text>
              <Text style={styles.tableCellBottomText}>(M/F)</Text>
            </MyTableCell>
            <MyTableCell style={styles.tableCell}>
              <Text>Birth Date</Text>
              <Text style={styles.tableCellBottomText}>(mm/dd/yyyy)</Text>
            </MyTableCell>
            <MyTableCell style={styles.tableCell}>Age as of 1st Friday June</MyTableCell>
            <MyTableCell style={styles.tableCell}>Mother Tongue</MyTableCell>
            <MyTableCell style={styles.tableCell}>
              <Text>IP</Text>
              <Text style={styles.tableCellBottomText}>(Ethnic Group)</Text>
            </MyTableCell>
            <MyTableCell style={styles.tableCell}>Religion</MyTableCell>
            <MyTableCell style={styles.tableCell}>
              <Text>Address</Text>
              <Text style={styles.tableCellBottomText}>(House # Street, Barangay, City, Province)</Text>
            </MyTableCell>
            <MyTableCell style={styles.tableCell}>Father's Name</MyTableCell>
            <MyTableCell style={styles.tableCell}>Mother's Maiden Name</MyTableCell>
            <MyTableCell style={styles.tableCell}>
              <Text>Guardian's Name</Text>
              <Text style={styles.tableCellBottomText}>(if not parent)</Text>
            </MyTableCell>
            <MyTableCell style={styles.tableCell}>
              <Text>Relationship with Guardian</Text>
              <Text style={styles.tableCellBottomText}>(if not parent)</Text>
            </MyTableCell>
            <MyTableCell style={styles.tableCell}>Contact Number of Parent or Guardian</MyTableCell>
            {/* <MyTableCell style={styles.tableCell}>Remarks</MyTableCell> */}
          </MyTableHeader>
          <MyTableBody>
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformationType) => r.lrn} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformationType) => `${r.full_name}`} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformationType) => r.gender} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformationType) => r.birth_date} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformationType) => new Date("06-01-2024").getFullYear() - new Date(r.birth_date as string).getFullYear()} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformationType) => r.mother_tongue} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformationType) => r.ip} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformationType) => r.religion} />
            <DataTableCell style={[styles.dataTableCell, { fontSize: 8 }]} getContent={(r: StudentInformationType) => r.address} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformationType) => r.father_name} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformationType) => r.mother_name} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformationType) => r.guardian_name} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformationType) => r.guardian_relationship} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformationType) => r.contact_number_parent_guardian} />
            {/* <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => r.Remarks} /> */}
          </MyTableBody>
        </MyTable>
      </View>
    </Page>
  </Document>
);
// Create Document Component
const DocumentSecondSPF = ({ data, gradeLevel, section, month }: { data: AttendanceTableColumn[]; gradeLevel: string; section: string; month: string }) => (
  <Document>
    <Page size='LEGAL' orientation='landscape' style={styles.page}>
      {/* BUONG PAGE */}
      <View style={styles.marginPage}>
        {/* header */}
        <View style={styles.header}>
          {/* logo */}
          <View>
            <Image style={styles.logo} source='deped logo' src='/deped_logo.png' />
          </View>
          {/* school information */}
          <View style={styles.schoolInformationView}>
            {/* Title */}
            <View style={styles.titleView}>
              <Text style={styles.titleText}>School Form 2 (SF2) Daily Attendance Report of Learners</Text>
              <Text style={styles.subtitleText}>(This replaces Form 1, Form 2 & STS Form 4)</Text>
            </View>
            {/* School Information bottom */}
            <View style={styles.schoolInformationBottomView}>
              <Text>
                School ID <Text style={styles.normalText}>SR-10045-DV-01</Text>
              </Text>
              <Text>
                Region <Text style={styles.normalText}>IV-A</Text>
              </Text>
              <Text>
                Division <Text style={styles.normalText}>4A</Text>
              </Text>
              <Text>
                District <Text style={styles.normalText}>1</Text>
              </Text>
              <Text>
                School Name <Text style={styles.normalText}>Santa Rosa Elementary School Central I</Text>
              </Text>
              <Text>
                School Year <Text style={styles.normalText}>2023-2024</Text>
              </Text>
              <Text>
                Grade Level <Text style={styles.normalText}>{gradeLevel}</Text>
              </Text>
              <Text>
                Section <Text style={styles.normalText}>{section}</Text>
              </Text>
              <Text>
                Report for the month of <Text style={styles.normalText}>{month}</Text>
              </Text>
            </View>
          </View>
        </View>
        {/* body */}
        {/* Table */}
        <MyTable data={[...data]}>
          <MyTableHeader>
            <MyTableCell style={styles.tableCellName}>
              <Text>Learner's Name</Text>
              <Text>(Last Name, First Name, Middle Name)</Text>
            </MyTableCell>
            {data.map((student) => student.attendance?.map((v, index) => <MyTableCell style={styles.tableCell}>{index + 1}</MyTableCell>))}
          </MyTableHeader>
          <MyTableBody>
            <DataTableCell style={styles.dataTableCellName} getContent={(r: AttendanceTableColumn) => r.name} />
            {data.map((student) => student.attendance?.map((v, index) => <DataTableCell style={styles.dataTableCellAttendance} getContent={(r: AttendanceTableColumn) => (v ? "" : "X")} />))}
          </MyTableBody>
        </MyTable>
      </View>
    </Page>
  </Document>
);

export type StudentInformationType = {
  id: number;
  full_name: string;
  lrn: number;
  mother_tongue: string;
  ip: string;
  religion: string;
  address: string;
  father_name: string;
  mother_name: string;
  guardian_name: string;
  guardian_relationship: string;
  contact_number_parent_guardian: string;
  birth_date: string;
  gender: string;
};

export type AttendanceInformationType = {
  name: string;
  attendance: Json | null;
  section: string;
  grade_level: GradeLevelEnum;
};

export type AttendanceTableColumn = {
  name: string;
  attendance: boolean[];
};

export type AttendanceJSONType = {
  date: string;
};

export type StudentGradesType = {
  name: string;
  activities_percentage: number;
  quiz_percentage: number;
  activities_total_points: number;
  activities_student_total_points: number;
  quiz_total_points: number;
  quiz_students_total_points: number;
};

const ReportsPage = () => {
  const [data, setData] = useState<StudentInformationType[]>();
  const gradeLevels = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];
  const [gradeLevel, setGradeLevel] = useState<GradeLevelEnum>("Grade 1");
  const [section, setSection] = useState<string>("");
  const [sections, setSections] = useState<Classroom[]>();
  const [classroomId, setClassroomId] = useState<string>("");
  const [monthAttendance, setMonthAttendance] = useState("0");
  const [attendance, setAttendance] = useState<AttendanceTableColumn[]>();
  const [attendanceColumn, setAttendanceColumn] = useState<any | undefined>();
  const [quarter, setQuarter] = useState<QuarterEnum>("1st Quarter");
  const [grades, setGrades] = useState<StudentGradesType[]>();

  useEffect(() => {
    const fetchAllGrades = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_summary_totals_per_student", { class_grade_level: gradeLevel, class_quarter: quarter, class_section: section });
      console.log(data);
      const gradesArray: StudentGradesType[] = [];
      data?.map((v) => {
        gradesArray.push({
          name: v.name,
          activities_percentage: v.student_answers_activities_total_points_sum / v.activities_total_points_sum,
          quiz_percentage: v.quiz_total_points_activities_sum / v.quiz_total_points_sum,
          activities_student_total_points: v.student_answers_activities_total_points_sum,
          activities_total_points: v.activities_total_points_sum,
          quiz_total_points: v.quiz_total_points_sum,
          quiz_students_total_points: v.quiz_total_points_activities_sum,
        });
      });

      setGrades(gradesArray);
    };

    fetchAllGrades();
  }, [section, quarter]);

  useEffect(() => {
    const fetchAllSections = async () => {
      try {
        const supabase = createClient();
        // depend on grade and section -- to do
        const { data, error } = await supabase.from("classrooms").select("*").eq("grade_level", gradeLevel);
        if (data) setSections(data.sort((a, b) => compare(a.section, b.section)));
        return data;
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllSections();
    setSection("");
  }, [gradeLevel]);

  useEffect(() => {
    const fetchStudentInformation = async () => {
      try {
        const supabase = createClient();

        // depend on grade and section
        const { data, error } = await supabase.rpc("get_reports_student_information", { arg_grade_level: gradeLevel, arg_section: section });
        // const {data, error } = await supabase.from("classrooms").select("*, students(*)")
        if (error) throw new Error(error.message);
        if (data) setData(data);
        return data;
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudentInformation();
  }, [classroomId]);

  useEffect(() => {
    const fetchClassroomId = async () => {
      try {
        const supabase = createClient();

        // fetch classroomId
        const { data: classroom, error: classroomError } = await supabase.from("classrooms").select().match({ grade_level: gradeLevel, section: section }).single();
        if (classroomError) throw new Error(classroomError.message);
        setClassroomId(classroom.id);
      } catch (e) {
        console.error(e);
      }
    };

    fetchClassroomId();
  }, [section]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const supabase = createClient();
        const yearToday = new Date().getFullYear();
        const days = getDaysInMonth(new Date(yearToday, parseInt(monthAttendance)));

        const first_date = `${parseInt(monthAttendance) + 1}-01-${yearToday}`;
        const last_date = `${parseInt(monthAttendance) + 1}-${days}-${yearToday}`;

        const { data, error } = await supabase.rpc("get_student_attendance", { date_first: first_date, date_last: last_date, class_grade_level: gradeLevel, class_section: section });
        if (error) throw new Error(error.message);
        console.log(data);

        const totalAttendanceArray = new Array(days).fill(0);

        const array = data?.map((student) => {
          const a = student.attendance as AttendanceJSONType[];
          const studentAttendance = a.map(({ date }: { date: string }) => new Date(date).getDate() - 1);
          const attendedDatesSet = new Set(studentAttendance);

          const attendanceArray = Array.from({ length: days }, (_, index) => attendedDatesSet.has(index));
          attendanceArray.forEach((a, index) => (a ? (totalAttendanceArray[index] += 1) : null));

          return {
            name: student.name,
            attendance: attendanceArray,
          };
        });
        const columns = generateColumn(days);
        console.log(totalAttendanceArray);
        setAttendanceColumn(columns);
        setAttendance(array);
      } catch (e) {
        console.error(e);
      }
    };

    fetchAttendance();
    // getAttendancePerStudentArray(attendance);
  }, [section, monthAttendance]);

  return (
    <div className='mt-10 pr-3'>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2'>
          <Select onValueChange={(v) => setGradeLevel(v as GradeLevelEnum)} value={gradeLevel}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Grade Level' />
            </SelectTrigger>
            <SelectContent>
              {gradeLevels.map((g, i) => (
                <SelectItem key={i} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {sections && (
            <Select onValueChange={(v) => setSection(v)} value={section}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Section' />
              </SelectTrigger>
              <SelectContent>
                {sections.map((s) => (
                  <SelectItem key={s.id} value={s.section}>
                    {s.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Tabs defaultValue='account' className=''>
          <TabsList>
            <TabsTrigger value='sf1'>School Information</TabsTrigger>
            <TabsTrigger value='sf2'>Attendance</TabsTrigger>
            <TabsTrigger value='grades'>Grades</TabsTrigger>
          </TabsList>
          <TabsContent value='sf1'>
            <div className='font-bold text-2xl mb-4'>School Form 1: School Register</div>

            {data && (
              <div className='mt-5'>
                {section && (
                  <div>
                    <Suspense fallback={<p>Loading...</p>}>
                      {/* <PDFViewer className='w-full' height={900}>
          <DocumentFirstSPF data={data} gradeLevel={gradeLevel.split(" ")[1]} section={section} />
        </PDFViewer> */}
                      <div className='mb-5'>
                        <DataTable columns={columns} data={data as StudentInformationType[]} />
                      </div>
                      <PDFDownloadLink
                        className='w-fit flex'
                        document={<DocumentFirstSPF data={data} gradeLevel={gradeLevel.split(" ")[1]} section={section} />}
                        fileName={`SF1_${gradeLevel.trim()}_${section}_${new Date().getFullYear()}.pdf`}
                      >
                        {({ blob, url, loading, error }) => (
                          <div aria-disabled={loading} className={cn("text-primary-foreground font-bold bg-primary px-4 py-2 rounded-md w-fit text-center", loading && "select-none bg-primary/80")}>
                            {loading ? "Loading Document..." : "Download SF1 PDF"}
                          </div>
                        )}
                      </PDFDownloadLink>
                    </Suspense>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value='sf2'>
            <div className='font-bold text-2xl mb-4'>School Form 2: Attendance</div>
            <Select
              onValueChange={async (v) => {
                setMonthAttendance(v);
              }}
              value={monthAttendance}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Month of attendance' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='0'>January</SelectItem>
                <SelectItem value='1'>February</SelectItem>
                <SelectItem value='2'>March</SelectItem>
                <SelectItem value='3'>April</SelectItem>
                <SelectItem value='4'>May</SelectItem>
                <SelectItem value='5'>June</SelectItem>
                <SelectItem value='6'>July</SelectItem>
                <SelectItem value='7'>August</SelectItem>
                <SelectItem value='8'>September</SelectItem>
                <SelectItem value='9'>October</SelectItem>
                <SelectItem value='10'>November</SelectItem>
                <SelectItem value='11'>December</SelectItem>
              </SelectContent>
            </Select>
            {/* Add the table for attendance here */}
            <div className='mt-4'>{attendance && <DataTable columns={attendanceColumn} data={attendance as AttendanceTableColumn[]} />}</div>
            {/* Add downloadable pdf */}
            <div className='mt-5'>
              {/* {attendance && (
                <PDFViewer className='w-full' height={900}>
                  <DocumentSecondSPF month={format(new Date(`${parseInt(monthAttendance) + 1}-01-2024`), "MMMM")} data={attendance} gradeLevel={gradeLevel.split(" ")[1]} section={section} />
                </PDFViewer>
              )} */}
              {attendance && (
                <PDFDownloadLink
                  className='w-fit flex'
                  document={
                    <DocumentSecondSPF month={format(new Date(`${parseInt(monthAttendance) + 1}-01-2024`), "MMMM")} data={attendance} gradeLevel={gradeLevel.split(" ")[1]} section={section} />
                  }
                  fileName={`SF2_${gradeLevel.trim()}_${section}_${new Date().getFullYear()}_${format(new Date(`${parseInt(monthAttendance) + 1}-01-2024`), "MMMM")}_.pdf`}
                >
                  {({ blob, url, loading, error }) => (
                    <div aria-disabled={loading} className={cn("text-primary-foreground font-bold bg-primary px-4 py-2 rounded-md w-fit text-center", loading && "select-none bg-primary/80")}>
                      {loading ? "Loading Document..." : "Download SF2 PDF"}
                    </div>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          </TabsContent>
          <TabsContent value='grades'>
            <Select onValueChange={(v) => setQuarter(v as QuarterEnum)}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Set quarter' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1st Quarter'>1st Quarter</SelectItem>
                <SelectItem value='2nd Quarter'>2nd Quarter</SelectItem>
                <SelectItem value='3rd Quarter'>3rd Quarter</SelectItem>
                <SelectItem value='4th Quarter'>4th Quarter</SelectItem>
              </SelectContent>
            </Select>
            <div className='mt-5'>{grades && <DataTable columns={studentGradeColumns} data={grades as StudentGradesType[]} />}</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsPage;
