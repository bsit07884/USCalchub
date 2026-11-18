export const HOURLY_WAGE_COHORT_MATRIX = {
  // Standard Annual Work Hours = 40 hours/week * 52 weeks = 2,080 hours
  tiers: [
    {
      rate: 15,
      hourlyDisplay: "$15/hr",
      annualGross: 31200,
      annualGrossDisplay: "$31,200/yr",
      prev: null,
      next: {
        rate: 18,
        hourlyDisplay: "$18/hr",
        slug: "18-an-hour",
        annualGross: 37440,
        annualDiff: 6240,
        annualDiffDisplay: "+$6,240/yr"
      }
    },
    {
      rate: 18,
      hourlyDisplay: "$18/hr",
      annualGross: 37440,
      annualGrossDisplay: "$37,440/yr",
      prev: {
        rate: 15,
        hourlyDisplay: "$15/hr",
        slug: "15-an-hour",
        annualGross: 31200,
        annualDiff: -6240,
        annualDiffDisplay: "-$6,240/yr"
      },
      next: {
        rate: 20,
        hourlyDisplay: "$20/hr",
        slug: "20-an-hour",
        annualGross: 41600,
        annualDiff: 4160,
        annualDiffDisplay: "+$4,160/yr"
      }
    },
    {
      rate: 20,
      hourlyDisplay: "$20/hr",
      annualGross: 41600,
      annualGrossDisplay: "$41,600/yr",
      prev: {
        rate: 18,
        hourlyDisplay: "$18/hr",
        slug: "18-an-hour",
        annualGross: 37440,
        annualDiff: -4160,
        annualDiffDisplay: "-$4,160/yr"
      },
      next: {
        rate: 22,
        hourlyDisplay: "$22/hr",
        slug: "22-an-hour",
        annualGross: 45760,
        annualDiff: 4160,
        annualDiffDisplay: "+$4,160/yr"
      }
    },
    {
      rate: 22,
      hourlyDisplay: "$22/hr",
      annualGross: 45760,
      annualGrossDisplay: "$45,760/yr",
      prev: {
        rate: 20,
        hourlyDisplay: "$20/hr",
        slug: "20-an-hour",
        annualGross: 41600,
        annualDiff: -4160,
        annualDiffDisplay: "-$4,160/yr"
      },
      next: {
        rate: 25,
        hourlyDisplay: "$25/hr",
        slug: "25-an-hour",
        annualGross: 52000,
        annualDiff: 6240,
        annualDiffDisplay: "+$6,240/yr"
      }
    },
    {
      rate: 25,
      hourlyDisplay: "$25/hr",
      annualGross: 52000,
      annualGrossDisplay: "$52,000/yr",
      prev: {
        rate: 22,
        hourlyDisplay: "$22/hr",
        slug: "22-an-hour",
        annualGross: 45760,
        annualDiff: -6240,
        annualDiffDisplay: "-$6,240/yr"
      },
      next: {
        rate: 28,
        hourlyDisplay: "$28/hr",
        slug: "28-an-hour",
        annualGross: 58240,
        annualDiff: 6240,
        annualDiffDisplay: "+$6,240/yr"
      }
    },
    {
      rate: 28,
      hourlyDisplay: "$28/hr",
      annualGross: 58240,
      annualGrossDisplay: "$58,240/yr",
      prev: {
        rate: 25,
        hourlyDisplay: "$25/hr",
        slug: "25-an-hour",
        annualGross: 52000,
        annualDiff: -6240,
        annualDiffDisplay: "-$6,240/yr"
      },
      next: {
        rate: 30,
        hourlyDisplay: "$30/hr",
        slug: "30-an-hour",
        annualGross: 62400,
        annualDiff: 4160,
        annualDiffDisplay: "+$4,160/yr"
      }
    },
    {
      rate: 30,
      hourlyDisplay: "$30/hr",
      annualGross: 62400,
      annualGrossDisplay: "$62,400/yr",
      prev: {
        rate: 28,
        hourlyDisplay: "$28/hr",
        slug: "28-an-hour",
        annualGross: 58240,
        annualDiff: -4160,
        annualDiffDisplay: "-$4,160/yr"
      },
      next: {
        rate: 32,
        hourlyDisplay: "$32/hr",
        slug: "32-an-hour",
        annualGross: 66560,
        annualDiff: 4160,
        annualDiffDisplay: "+$4,160/yr"
      }
    },
    {
      rate: 32,
      hourlyDisplay: "$32/hr",
      annualGross: 66560,
      annualGrossDisplay: "$66,560/yr",
      prev: {
        rate: 30,
        hourlyDisplay: "$30/hr",
        slug: "30-an-hour",
        annualGross: 62400,
        annualDiff: -4160,
        annualDiffDisplay: "-$4,160/yr"
      },
      next: {
        rate: 35,
        hourlyDisplay: "$35/hr",
        slug: "35-an-hour",
        annualGross: 72800,
        annualDiff: 6240,
        annualDiffDisplay: "+$6,240/yr"
      }
    },
    {
      rate: 35,
      hourlyDisplay: "$35/hr",
      annualGross: 72800,
      annualGrossDisplay: "$72,800/yr",
      prev: {
        rate: 32,
        hourlyDisplay: "$32/hr",
        slug: "32-an-hour",
        annualGross: 66560,
        annualDiff: -6240,
        annualDiffDisplay: "-$6,240/yr"
      },
      next: {
        rate: 40,
        hourlyDisplay: "$40/hr",
        slug: "40-an-hour",
        annualGross: 83200,
        annualDiff: 10400,
        annualDiffDisplay: "+$10,400/yr"
      }
    },
    {
      rate: 40,
      hourlyDisplay: "$40/hr",
      annualGross: 83200,
      annualGrossDisplay: "$83,200/yr",
      prev: {
        rate: 35,
        hourlyDisplay: "$35/hr",
        slug: "35-an-hour",
        annualGross: 72800,
        annualDiff: -10400,
        annualDiffDisplay: "-$10,400/yr"
      },
      next: {
        rate: 45,
        hourlyDisplay: "$45/hr",
        slug: "45-an-hour",
        annualGross: 93600,
        annualDiff: 10400,
        annualDiffDisplay: "+$10,400/yr"
      }
    },
    {
      rate: 45,
      hourlyDisplay: "$45/hr",
      annualGross: 93600,
      annualGrossDisplay: "$93,600/yr",
      prev: {
        rate: 40,
        hourlyDisplay: "$40/hr",
        slug: "40-an-hour",
        annualGross: 83200,
        annualDiff: -10400,
        annualDiffDisplay: "-$10,400/yr"
      },
      next: {
        rate: 50,
        hourlyDisplay: "$50/hr",
        slug: "50-an-hour",
        annualGross: 104000,
        annualDiff: 10400,
        annualDiffDisplay: "+$10,400/yr"
      }
    },
    {
      rate: 50,
      hourlyDisplay: "$50/hr",
      annualGross: 104000,
      annualGrossDisplay: "$104,000/yr",
      prev: {
        rate: 45,
        hourlyDisplay: "$45/hr",
        slug: "45-an-hour",
        annualGross: 93600,
        annualDiff: -10400,
        annualDiffDisplay: "-$10,400/yr"
      },
      next: {
        rate: 55,
        hourlyDisplay: "$55/hr",
        slug: "55-an-hour",
        annualGross: 114400,
        annualDiff: 10400,
        annualDiffDisplay: "+$10,400/yr"
      }
    },
    {
      rate: 55,
      hourlyDisplay: "$55/hr",
      annualGross: 114400,
      annualGrossDisplay: "$114,400/yr",
      prev: {
        rate: 50,
        hourlyDisplay: "$50/hr",
        slug: "50-an-hour",
        annualGross: 104000,
        annualDiff: -10400,
        annualDiffDisplay: "-$10,400/yr"
      },
      next: {
        rate: 60,
        hourlyDisplay: "$60/hr",
        slug: "60-an-hour",
        annualGross: 124800,
        annualDiff: 10400,
        annualDiffDisplay: "+$10,400/yr"
      }
    },
    {
      rate: 60,
      hourlyDisplay: "$60/hr",
      annualGross: 124800,
      annualGrossDisplay: "$124,800/yr",
      prev: {
        rate: 55,
        hourlyDisplay: "$55/hr",
        slug: "55-an-hour",
        annualGross: 114400,
        annualDiff: -10400,
        annualDiffDisplay: "-$10,400/yr"
      },
      next: {
        rate: 65,
        hourlyDisplay: "$65/hr",
        slug: "65-an-hour",
        annualGross: 135200,
        annualDiff: 10400,
        annualDiffDisplay: "+$10,400/yr"
      }
    },
    {
      rate: 65,
      hourlyDisplay: "$65/hr",
      annualGross: 135200,
      annualGrossDisplay: "$135,200/yr",
      prev: {
        rate: 60,
        hourlyDisplay: "$60/hr",
        slug: "60-an-hour",
        annualGross: 124800,
        annualDiff: -10400,
        annualDiffDisplay: "-$10,400/yr"
      },
      next: {
        rate: 70,
        hourlyDisplay: "$70/hr",
        slug: "70-an-hour",
        annualGross: 145600,
        annualDiff: 10400,
        annualDiffDisplay: "+$10,400/yr"
      }
    },
    {
      rate: 70,
      hourlyDisplay: "$70/hr",
      annualGross: 145600,
      annualGrossDisplay: "$145,600/yr",
      prev: {
        rate: 65,
        hourlyDisplay: "$65/hr",
        slug: "65-an-hour",
        annualGross: 135200,
        annualDiff: -10400,
        annualDiffDisplay: "-$10,400/yr"
      },
      next: {
        rate: 75,
        hourlyDisplay: "$75/hr",
        slug: "75-an-hour",
        annualGross: 156000,
        annualDiff: 10400,
        annualDiffDisplay: "+$10,400/yr"
      }
    },
    {
      rate: 75,
      hourlyDisplay: "$75/hr",
      annualGross: 156000,
      annualGrossDisplay: "$156,000/yr",
      prev: {
        rate: 70,
        hourlyDisplay: "$70/hr",
        slug: "70-an-hour",
        annualGross: 145600,
        annualDiff: -10400,
        annualDiffDisplay: "-$10,400/yr"
      },
      next: {
        rate: 80,
        hourlyDisplay: "$80/hr",
        slug: "80-an-hour",
        annualGross: 166400,
        annualDiff: 10400,
        annualDiffDisplay: "+$10,400/yr"
      }
    },
    {
      rate: 80,
      hourlyDisplay: "$80/hr",
      annualGross: 166400,
      annualGrossDisplay: "$166,400/yr",
      prev: {
        rate: 75,
        hourlyDisplay: "$75/hr",
        slug: "75-an-hour",
        annualGross: 156000,
        annualDiff: -10400,
        annualDiffDisplay: "-$10,400/yr"
      },
      next: {
        rate: 90,
        hourlyDisplay: "$90/hr",
        slug: "90-an-hour",
        annualGross: 187200,
        annualDiff: 20800,
        annualDiffDisplay: "+$20,800/yr"
      }
    },
    {
      rate: 90,
      hourlyDisplay: "$90/hr",
      annualGross: 187200,
      annualGrossDisplay: "$187,200/yr",
      prev: {
        rate: 80,
        hourlyDisplay: "$80/hr",
        slug: "80-an-hour",
        annualGross: 166400,
        annualDiff: -20800,
        annualDiffDisplay: "-$20,800/yr"
      },
      next: {
        rate: 100,
        hourlyDisplay: "$100/hr",
        slug: "100-an-hour",
        annualGross: 208000,
        annualDiff: 20800,
        annualDiffDisplay: "+$20,800/yr"
      }
    },
    {
      rate: 100,
      hourlyDisplay: "$100/hr",
      annualGross: 208000,
      annualGrossDisplay: "$208,000/yr",
      prev: {
        rate: 90,
        hourlyDisplay: "$90/hr",
        slug: "90-an-hour",
        annualGross: 187200,
        annualDiff: -20800,
        annualDiffDisplay: "-$20,800/yr"
      },
      next: null
    }
  ]
};


export function getWageCohort(rate) {
  return HOURLY_WAGE_COHORT_MATRIX.tiers.find(t => t.rate === Number(rate)) || null;
}
