'use-strict'
const config = require('../config')

const firebase = require('firebase/compat/app')
const Firestore = require('firebase/compat/firestore')

// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';

const Student = require('../models/studentModel')

firebase.initializeApp(config.firebaseConfig);

const firestore = firebase.firestore()

const addStudent = async (req,res,next)=>{
    try{
        const data= req.body
     await firestore.collection('students').doc().set(data)
          res.send('Record saved successfully')
    }catch(error){
        res.status(400).send(error.message)
    }
}

const getAllStudents = async function(req,res,next){
    try{
     const students = await firestore.collection('students')
     const data = await students.get()
     const studentsArray = []
     if(data.empty){
        res.status(404).send('No student record found')
     }
     else{
        data.forEach(doc=>{
              const student = new Student(
                    doc.id,
                    doc.data().firstName,
                    doc.data().lasttName,
                    doc.data().fatherName,
                    doc.data().class,
                    doc.data().age,
                    doc.data().phone,
                    doc.data().subject,
                    doc.data().year,
                    doc.data().semester,
                    doc.data().status,
                   )
                   studentsArray.push(student)
        })
        res.send(studentsArray)
     }
    }catch(error){
        res.status(500).send(error.message)
    }
}


const getStudent =async function(req,res,next){
    try {
        const id=req.params.id
        const student = await firestore.collection('students').doc(id)
        const data =await student.get()
        if(!data.exists){
            res.status(404).send('No record found')
         }else{
            res.send(data.data())
         }
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}

const updateStudent =async function(req,res,next){
    try{
    const id =req.params.id
    const data = req.body 
    const student = await firestore.collection('students').doc(id)
    await student.update(data)
    res.send('student record updated successfully')
    }catch(error){
        res.status(500).send(error.message)
    }
}

const deleteStudent =async function(req,res,next){
    try{
    const id =req.params.id

    const student =await firestore.collection('students').doc(id).delete()
    res.send('Record deleted successfully')
    }catch(error){
        res.status(500).send(error.message)
    }
}


module.exports = {addStudent,getAllStudents,getStudent,updateStudent,deleteStudent}


