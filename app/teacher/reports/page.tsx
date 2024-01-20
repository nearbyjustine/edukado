"use client";

import React from "react";
import ReactPDF, { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink, Image, Font } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Table } from "@david.kucsai/react-pdf-table/lib/Table";
import { TableHeader } from "@david.kucsai/react-pdf-table/lib/TableHeader";
import { TableCell } from "@david.kucsai/react-pdf-table/lib/TableCell";
import { DataTableCell } from "@david.kucsai/react-pdf-table/lib/DataTableCell";
import { TableBody } from "@david.kucsai/react-pdf-table/lib/TableBody";
import { fakeData } from "@/utils/fakeData";
import { createClient } from "@/utils/supabase/client";
import { StudentInformation } from "@/lib/collection.types";

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
const MyDocument = ({ data }: { data: StudentInformation[] }) => (
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
                Grade Level <Text style={styles.normalText}>1</Text>
              </Text>
              <Text>
                Section <Text style={styles.normalText}>Mabini</Text>
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
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => r.lrn} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => `${r.profiles?.last_name}, ${r.profiles?.first_name}, ${r.profiles?.middle_name}`} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => r.profiles?.gender} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => r.profiles?.birth_date} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => new Date("06-01-2024").getFullYear() - new Date(r.profiles?.birth_date as string).getFullYear()} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => r.mother_tongue} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => r.ip} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => r.religion} />
            <DataTableCell style={[styles.dataTableCell, { fontSize: 8 }]} getContent={(r: StudentInformation) => r.address} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => r.father_name} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => r.mother_name} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => r.guardian_name} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => r.guardian_relationship} />
            <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => r.contact_number_parent_guardian} />
            {/* <DataTableCell style={styles.dataTableCell} getContent={(r: StudentInformation) => r.Remarks} /> */}
          </MyTableBody>
        </MyTable>
      </View>
    </Page>
  </Document>
);

const fetchStudentInformation = async () => {
  try {
    const supabase = createClient();
    // depend on grade and section -- to do
    const { data, error } = await supabase.from("student_information").select("*, profiles(*)");
    return data;
  } catch (error) {
    console.log(error);
  }
};

const ReportsPage = async () => {
  const data = await fetchStudentInformation();
  console.log(data);
  if (data) {
    return (
      <div className='mt-20'>
        <PDFViewer className='w-full' height={900}>
          <MyDocument data={data} />
        </PDFViewer>
        <PDFDownloadLink document={<MyDocument data={data} />} fileName='document.pdf'>
          {({ blob, url, loading, error }) => (loading ? "Loading document..." : "Download now!")}
        </PDFDownloadLink>
      </div>
    );
  }
};

export default ReportsPage;
