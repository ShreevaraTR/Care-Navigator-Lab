import type { SimulationCaseInput } from "@/domain/case";
import { case01, case02 } from "./case01-02";
import { case03, case04 } from "./case03-04";
import { case05, case06 } from "./case05-06";
import { case07, case08 } from "./case07-08";
import { case09, case10 } from "./case09-10";
import { case11, case12 } from "./case11-12";
import { case13, case14 } from "./case13-14";
import { case15, case16 } from "./case15-16";
import { case17, case18 } from "./case17-18";
import { case19, case20 } from "./case19-20";

/** The 20-case portfolio, in order (1–4 foundation … 20 capstone). */
export const portfolioCases: SimulationCaseInput[] = [
  case01, case02, case03, case04, case05, case06, case07, case08, case09, case10,
  case11, case12, case13, case14, case15, case16, case17, case18, case19, case20,
];
