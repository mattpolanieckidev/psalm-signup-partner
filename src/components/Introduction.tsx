
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Introduction = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 border-tehillim-blue/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-tehillim-blue">Welcome to our Tehillim Circle</CardTitle>
        <CardDescription>
          Together, we can complete all 150 psalms
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-4">
          The Book of Psalms, known in Hebrew as Tehillim, has been a source of comfort, 
          inspiration, and connection to the Divine for thousands of years.
        </p>
        <p>
          By signing up to recite one or more psalms, you are joining a collective effort to 
          complete all 150 chapters, bringing merit and blessing to our community and beyond.
        </p>
      </CardContent>
    </Card>
  );
};

export default Introduction;
