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
import { Classroom, GradeLevelEnum, StudentInformation } from "@/lib/collection.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { columns } from "./student-info-column";
import { DataTable } from "./datatable";

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
  tableCellBottomText: {
    fontSize: 7,
  },
  dataTableCell: {
    padding: 2,
  },
});

// Table change to any for TS
const MyTable: any = Table;
const MyTableHeader: any = TableHeader;
const MyTableCell: any = TableCell;
const MyTableBody: any = TableBody;

// Create Document Component
const MyDocument = ({ data, gradeLevel, section }: { data: StudentInformationType[]; gradeLevel: string; section: string }) => (
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

const ReportsPage = () => {
  const [data, setData] = useState<StudentInformationType[]>();
  const gradeLevels = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];
  const [gradeLevel, setGradeLevel] = useState<GradeLevelEnum>("Grade 1");
  const [section, setSection] = useState<string>("");
  const [sections, setSections] = useState<Classroom[]>();
  const [classroomId, setClassroomId] = useState<string>("");

  useEffect(() => {
    const fetchAllSections = async () => {
      try {
        const supabase = createClient();
        // depend on grade and section -- to do
        const { data, error } = await supabase.from("classrooms").select("*").eq("grade_level", gradeLevel);
        console.log(data, error);
        if (data) setSections(data);
        return data;
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllSections();
    setSection("");
  }, [gradeLevel]);

  useEffect(() => {
    console.log(gradeLevel, section);
    const fetchStudentInformation = async () => {
      try {
        const supabase = createClient();

        // depend on grade and section
        const { data, error } = await supabase.rpc("get_reports_student_information", { arg_grade_level: gradeLevel, arg_section: section });
        console.log(data, error);
        // const {data, error } = await supabase.from("classrooms").select("*, students(*)")
        if (error) throw new Error(error.message);
        console.log(data, error);
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

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  return (
    <div className='mt-10'>
      <div className='font-bold text-2xl mb-4'>School Form 1: School Register</div>
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
                <SelectItem value={s.section}>{s.section}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      {data && (
        <div className='mt-5'>
          {section && (
            <div>
              <Suspense fallback={<p>Loading...</p>}>
                {/* <PDFViewer className='w-full' height={900}>
                  <MyDocument data={data} gradeLevel={gradeLevel.split(" ")[1]} section={section} />
                </PDFViewer> */}
                <div className='mb-5'>
                  <DataTable columns={columns} data={data as StudentInformationType[]} />
                </div>
                <PDFDownloadLink className='w-fit flex' document={<MyDocument data={data} gradeLevel={gradeLevel.split(" ")[1]} section={section} />} fileName='document.pdf'>
                  {({ blob, url, loading, error }) =>
                    loading ? "Loading document..." : <div className='text-primary-foreground font-bold bg-primary px-4 py-2 rounded-md w-fit text-center'>Download SF1 PDF</div>
                  }
                </PDFDownloadLink>
              </Suspense>
            </div>
          )}
        </div>
      )}
      <div className='font-bold text-2xl my-4'>School Form 2: Attendance</div>
    </div>
  );
};

export default ReportsPage;
