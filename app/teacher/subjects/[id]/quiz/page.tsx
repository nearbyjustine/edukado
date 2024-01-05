import React from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import QuizForm from "@/components/forms/quiz-form";

const CreateQuizPage = () => {
  return (
    <div className='w-full md:w-2/3 lg:w-2/3 '>
      <QuizForm />
    </div>
  );
};

export default CreateQuizPage;
