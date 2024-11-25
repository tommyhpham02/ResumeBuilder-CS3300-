﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RsumeBuilder_Team_9_.Models
{
    public class Degree
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public string College { get; set; }
        public string CityAndState { get; set; }
        public string DegreeType { get; set; }
        public string DegreeName {  get; set; }
        public int YearGraduated { get; set; }
    }
}
